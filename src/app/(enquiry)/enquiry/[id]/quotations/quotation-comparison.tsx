"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EnquiryItem } from "../../store/enquiry-store"; // Reuse type or define shared type

// Mock Types
interface QuotationItem {
  itemId: string;
  rate: number;
  remarks?: string;
  availability?: string;
}

interface Quotation {
  id: string;
  sellerName: string;
  totalAmount: number;
  items: QuotationItem[];
}

interface QuotationComparisonProps {
  enquiryItems: EnquiryItem[];
  quotation: Quotation;
}

export function QuotationComparison({
  enquiryItems,
  quotation,
}: QuotationComparisonProps) {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">
          Quotation from {quotation.sellerName}
        </h3>
        <Badge variant="outline" className="text-base px-3 py-1">
          Total: ₹{quotation.totalAmount.toLocaleString()}
        </Badge>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[40%]">
                Item Details (Requested)
              </TableHead>
              <TableHead className="w-[15%] text-right">Quantity</TableHead>
              <TableHead className="w-[20%] text-right">Quoted Rate</TableHead>
              <TableHead className="w-[25%]">Seller Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enquiryItems.map((item) => {
              const quoteItem = quotation.items.find(
                (q) => q.itemId === item.itemId
              );
              return (
                <TableRow key={item.itemId}>
                  {/* Enquiry Side */}
                  <TableCell>
                    <div className="font-medium">{item.name}</div>
                    {item.remarks && (
                      <div className="text-xs text-muted-foreground italic">
                        &quot;{item.remarks}&quot;
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.quantity} {item.unit}
                  </TableCell>

                  {/* Quotation Side */}
                  <TableCell className="text-right font-semibold">
                    {quoteItem ? (
                      `₹${quoteItem.rate.toLocaleString()}`
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {quoteItem?.remarks || (
                      <span className="text-muted-foreground text-xs font-light">
                        No remarks
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {/* Total Row */}
            <TableRow className="bg-muted/20 font-medium">
              <TableCell colSpan={2} className="text-right">
                Total Estimated cost
              </TableCell>
              <TableCell className="text-right text-primary">
                ₹{quotation.totalAmount.toLocaleString()}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
