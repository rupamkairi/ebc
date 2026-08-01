import { format } from "date-fns";
import { WalletTransaction } from "@/types/wallet";

const PAGE_HEIGHT = 842;

export interface WalletReceiptDetails {
  transaction: WalletTransaction;
  purpose: string;
}

function escapePdfText(value: string): string {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)")
    .replace(/[^\x20-\x7E]/g, "?");
}

function getJpegSize(bytes: Uint8Array): { width: number; height: number } {
  let offset = 2;
  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = bytes[offset + 1];
    const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        height: (bytes[offset + 5] << 8) | bytes[offset + 6],
        width: (bytes[offset + 7] << 8) | bytes[offset + 8],
      };
    }
    offset += 2 + length;
  }

  throw new Error("Unable to read the receipt logo.");
}

function base64ToBytes(value: string): Uint8Array {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function loadLogo(): Promise<{ bytes: Uint8Array; width: number; height: number }> {
  const image = new Image();
  image.src = "/favicon.png";
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Unable to load the ECON logo."));
  });

  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to prepare the ECON logo.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0);

  const bytes = base64ToBytes(canvas.toDataURL("image/jpeg", 0.92).split(",")[1]);
  return { ...getJpegSize(bytes), bytes };
}

function textLine(text: string, x: number, y: number, size = 12): string {
  return `BT /F1 ${size} Tf ${x} ${y} Td (${escapePdfText(text)}) Tj ET`;
}

export async function downloadWalletReceipt({
  transaction,
  purpose,
}: WalletReceiptDetails): Promise<void> {
  const logo = await loadLogo();
  const logoWidth = 132;
  const logoHeight = (logo.height / logo.width) * logoWidth;
  const signedCoins = `${transaction.type === "CREDIT" ? "+" : "-"}${transaction.cost.toLocaleString()} Coins`;
  const date = format(new Date(transaction.createdAt), "dd MMMM yyyy, hh:mm a");
  const paidAmount = transaction.amountInInr == null
    ? undefined
    : `INR ${transaction.amountInInr.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const rows = [
    ["Transaction ID", transaction.id],
    ["Date of transaction", date],
    ["Purpose", purpose],
    ["Coins", signedCoins],
    ...(paidAmount ? [["Amount paid", paidAmount]] : []),
  ];
  const content = [
    "q 0.95 0.97 0.98 rg 40 598 515 1 re f Q",
    `q ${logoWidth} 0 0 ${logoHeight} 40 ${PAGE_HEIGHT - 64 - logoHeight} cm /Logo Do Q`,
    "0.08 0.18 0.35 rg",
    textLine("ECON WALLET RECEIPT", 40, 700, 22),
    "0.32 0.37 0.44 rg",
    textLine("Receipt generated for a wallet transaction", 40, 677, 11),
    "0.08 0.18 0.35 rg",
    ...rows.flatMap(([label, value], index) => {
      const y = 560 - index * 66;
      return [
        "0.95 0.97 0.98 rg",
        `40 ${y - 17} 515 48 re f`,
        "0.32 0.37 0.44 rg",
        textLine(label, 56, y + 10, 10),
        "0.08 0.18 0.35 rg",
        textLine(value, 210, y + 10, 12),
      ];
    }),
    "0.32 0.37 0.44 rg",
    textLine("This is a system-generated receipt.", 40, 140, 10),
  ].join("\n");

  const encoder = new TextEncoder();
  const objects: Uint8Array[] = [
    encoder.encode("<< /Type /Catalog /Pages 2 0 R >>"),
    encoder.encode("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
    encoder.encode("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> /XObject << /Logo 5 0 R >> >> /Contents 6 0 R >>"),
    encoder.encode("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"),
    new Uint8Array([
      ...encoder.encode(`<< /Type /XObject /Subtype /Image /Width ${logo.width} /Height ${logo.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logo.bytes.length} >>\nstream\n`),
      ...logo.bytes,
      ...encoder.encode("\nendstream"),
    ]),
    encoder.encode(`<< /Length ${encoder.encode(content).length} >>\nstream\n${content}\nendstream`),
  ];

  const chunks: Uint8Array[] = [encoder.encode("%PDF-1.4\n")];
  const offsets = [0];
  let length = chunks[0].length;
  objects.forEach((object, index) => {
    offsets.push(length);
    const wrapped = new Uint8Array([
      ...encoder.encode(`${index + 1} 0 obj\n`),
      ...object,
      ...encoder.encode("\nendobj\n"),
    ]);
    chunks.push(wrapped);
    length += wrapped.length;
  });
  const xrefOffset = length;
  const xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${offset.toString().padStart(10, "0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  const xrefBytes = encoder.encode(xref);
  const pdfBuffer = new ArrayBuffer(length + xrefBytes.length);
  const pdfBytes = new Uint8Array(pdfBuffer);
  let cursor = 0;
  chunks.forEach((chunk) => {
    pdfBytes.set(chunk, cursor);
    cursor += chunk.length;
  });
  pdfBytes.set(xrefBytes, cursor);

  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([pdfBuffer], { type: "application/pdf" }));
  link.download = `econ-receipt-${transaction.id.slice(0, 8)}.pdf`;
  link.click();
  URL.revokeObjectURL(link.href);
}
