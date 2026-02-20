"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, MessageCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Session {
  id: string;
  title: string;
  organizer: string;
  tags: string[];
  description: string;
  status: "LIVE" | "UPCOMING" | "ON_DEMAND";
  timing: string;
  image: string;
}

interface SessionCardProps {
  session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
  const statusConfig = {
    LIVE: { label: "Live Now", color: "bg-red-500" },
    UPCOMING: { label: "Upcoming", color: "bg-[#FFA500]" },
    ON_DEMAND: { label: "On Demand", color: "bg-[#445EB4]" },
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row max-w-5xl mx-auto w-full group">
      {/* Left: Image Section */}
      <div className="relative w-full md:w-[280px] h-[200px] md:h-auto shrink-0 overflow-hidden">
        <Image
          src={session.image}
          alt={session.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className={cn(
            "absolute top-2 left-2 px-3 py-1 rounded-md text-[10px] font-black text-white uppercase tracking-wider",
            statusConfig[session.status].color
        )}>
          {statusConfig[session.status].label}
        </div>
      </div>

      {/* Right: Content Section */}
      <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-[#FFA500] font-black text-xl md:text-2xl leading-tight">
              {session.title}
            </h3>
          </div>
          
          <p className="text-slate-500 text-xs md:text-sm font-bold uppercase">
            Organized by : <span className="text-[#445EB4] hover:underline cursor-pointer">{session.organizer}</span>
          </p>

          <div className="flex flex-wrap gap-2">
            {session.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="bg-[#445EB4] hover:bg-[#445EB4]/90 text-white rounded-full px-4 py-1 text-[10px] font-medium tracking-tight border-none">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-slate-600 text-sm font-medium line-clamp-2">
            {session.description}
          </p>

          <div className="flex items-center gap-2 py-2">
             <Radio className={cn("size-4", session.status === "LIVE" ? "text-red-500 animate-pulse" : "text-slate-400")} />
             <span className="text-xs font-black text-slate-800 uppercase tracking-tight">
                {session.timing}
             </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
           <Button className="bg-[#FFA500] hover:bg-[#FFB733] text-white font-black text-xs uppercase tracking-tight rounded-md py-6 h-auto">
             {session.status === "ON_DEMAND" ? "Play Video" : "Join Session ( Free )"}
           </Button>
           <Button variant="outline" className="border-[#445EB4] text-[#445EB4] hover:bg-[#445EB4]/5 font-black text-xs uppercase tracking-tight rounded-md py-6 h-auto flex items-center gap-2">
             <MessageCircle className="size-4" />
             {session.status === "ON_DEMAND" ? "Ask a Question" : "Ask a Question"}
           </Button>
           <Button className="bg-[#445EB4] hover:bg-[#445EB4]/90 text-white font-black text-xs uppercase tracking-tight rounded-md py-6 h-auto flex items-center gap-2">
             <Info className="size-4" />
             Get Product Details
           </Button>
        </div>
      </div>
    </div>
  );
}

const dummySessions: Session[] = [
  {
    id: "1",
    title: "Efficient Waterproofing Solutions",
    organizer: "aqua waterproofing enjoyer",
    tags: ["Live Demo", "Materials", "Waterproofing", "Hindi"],
    description: "Live demo of waterproofing for G+1 homes",
    status: "LIVE",
    timing: "Streaming Now - 22:45 left",
    image: "/images/services/skilled-worker-installing-ceramic-wood-effect-tiles-floor-worker-making-laminate-flooring-construction-site-new-apartment 1.png"
  },
  {
    id: "2",
    title: "Learn how to reduce cement consumption without strength loss",
    organizer: "Abc Cement Enjoyer",
    tags: ["Webinar", "Materials", "Cement Ideas", "Bengali"],
    description: "Learn how to reduce cement consumption, Recommended for all houses",
    status: "UPCOMING",
    timing: "Upcoming - In 1h 30m",
    image: "/images/services/construction-residential-new-house-progress-building-site 1.png"
  },
  {
    id: "3",
    title: "New TMT steel grade explained for dealers",
    organizer: "SteelMax Steel enjoyer",
    tags: ["Product Launch", "Materials", "Dealers", "Hindi"],
    description: "Understand the benefits of our new TMT rebar steel range",
    status: "ON_DEMAND",
    timing: "Video - 1h : 17 min",
    image: "/images/services/architecture.png"
  },
  {
    id: "4",
    title: "Efficient Waterproofing Solutions",
    organizer: "aqua waterproofing enjoyer",
    tags: ["Live Demo", "Materials", "Waterproofing", "Hindi"],
    description: "Live demo of waterproofing for G+1 homes",
    status: "LIVE",
    timing: "Streaming Now - 22:45 left",
    image: "/images/services/site-engineer-construction-site 1.png"
  }
];

export function SessionList() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {dummySessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </div>
    </div>
  );
}
