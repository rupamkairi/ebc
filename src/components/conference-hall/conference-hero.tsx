"use client";

import Container from "@/components/containers/containers";
import Image from "next/image";
import { CheckCircle2, Video, Database, Tag, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  { icon: CheckCircle2, text: "Admin approved sessions" },
  { icon: CheckCircle2, text: "Direct from industry experts" },
  { icon: CheckCircle2, text: "Free Knowledge sharing" },
];

const actionButtons = [
  { icon: Video, text: "Live Consultation", color: "bg-white text-slate-900" },
  { icon: Database, text: "Data Bank", color: "bg-[#FFA500] text-white" },
  { icon: Tag, text: "Offers near You", color: "bg-[#FFA500] text-white" },
  { icon: BookOpen, text: "Digital Learning", color: "bg-[#FFA500] text-white" },
];

export function ConferenceHero() {
  return (
    <div className="relative pt-12">
      <Container size="xl" className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-black mb-4">
          <span className="text-[#445EB4]">Discover New Products,</span><br />
          <span className="text-[#FFA500]">Modern Services</span>{" "}
          <span className="text-[#445EB4]">&amp; Construction Innovations</span>
        </h1>
        <p className="text-slate-500 font-medium text-sm md:text-base max-w-3xl mx-auto px-4">
          Attend live demos, seminars, product launches &amp; expert sessions—directly from verified manufacturers and professionals.
        </p>
      </Container>

      {/* Blue Bar */}
      <div className="bg-[#445EB4] py-3 text-white mb-0 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <Container size="xl" className="flex justify-center items-center gap-6 md:gap-12 px-4">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <feature.icon className="size-5 text-[#FFA500]" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{feature.text}</span>
            </div>
          ))}
        </Container>
      </div>

      {/* Hero Image Section with Buttons Overlaid */}
      <div className="relative h-[250px] md:h-[450px] w-full overflow-hidden">
        <Image
          src="/images/conference-hall/conference-hall.png"
          alt="Conference Hall"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Floating Buttons on Image */}
        <div className="absolute inset-0 flex items-center justify-center">
            <Container size="xl" className="flex flex-wrap justify-center gap-3 md:gap-6 px-4">
                {actionButtons.map((btn, i) => (
                    <button 
                        key={i} 
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-full shadow-lg transition-transform hover:scale-110",
                            btn.color
                        )}
                    >
                        <btn.icon className="size-4 md:size-5" />
                        <span className="text-xs md:text-sm font-black whitespace-nowrap uppercase tracking-tight">{btn.text}</span>
                    </button>
                ))}
            </Container>
        </div>
      </div>
    </div>
  );
}
