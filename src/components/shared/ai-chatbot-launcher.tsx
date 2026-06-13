"use client";

import Image from "next/image";
import Link from "next/link";

export function AiChatbotLauncher() {
  return (
    <Link
      href="/calculator"
      aria-label="Open Nasir AI calculator"
      className="fixed bottom-[154px] right-5 z-50 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-secondary/40 active:scale-95 md:bottom-[172px] md:right-6 md:h-24 md:w-24"
    >
      <Image
        src="/images/nasir-chatbot.png"
        alt="Nasir AI construction assistant"
        fill
        sizes="(max-width: 768px) 80px, 96px"
        className="rounded-full object-cover"
      />
    </Link>
  );
}
