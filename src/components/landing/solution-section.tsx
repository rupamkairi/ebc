"use client";

import Container from "@/components/containers/containers";
import { TypographyH1 } from "@/components/ui/typography";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Play, MapPin } from "lucide-react";
import Image from "next/image";

interface ModalPoint {
  title: string;
  description: string;
}

interface SolutionCardProps {
  title: string;
  icon: string;
  points: string[];
  modalHeading: string;
  modalPoints: ModalPoint[];
}

function SolutionCard({
  title,
  icon,
  points,
  modalHeading,
  modalPoints,
}: SolutionCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col h-full group transition-all duration-300 hover:-translate-y-1 text-left cursor-pointer w-full border-none outline-none">
          {/* Upper White Section */}
          <div className="p-4 flex items-center gap-4 bg-white border-b border-slate-100 min-h-[80px] w-full">
            <div className="relative size-12 shrink-0">
              <Image
                src={icon}
                alt={title}
                fill
                className="object-contain"
                sizes="48px"
                unoptimized
              />
            </div>
            <h3 className="text-[#445EB4] font-black text-xl tracking-tight leading-tight">
              {title}
            </h3>
          </div>

          {/* Bottom Blue Section */}
          <div className="bg-[#445EB4] p-5 grow flex flex-col justify-center w-full">
            <ul className="space-y-3">
              {points.map((point, index) => (
                <li key={index} className="flex items-start gap-3 text-white">
                  <Play className="size-3 fill-[#FFA500] text-[#FFA500] mt-1 shrink-0" />
                  <span className="text-sm font-medium leading-snug">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-white rounded-2xl shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>{title} Details</DialogTitle>
        </DialogHeader>
        
        <div className="p-8 md:p-10 space-y-8">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
            {modalHeading}
          </h2>

          <div className="space-y-6">
            {modalPoints.map((point, index) => (
              <div key={index} className="flex gap-4">
                <MapPin className="size-6 text-[#E31E24] shrink-0 mt-1" />
                <div className="space-y-1">
                  <h4 className="font-black text-[#E31E24] text-lg">
                    {point.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-[15px]">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <DialogClose asChild>
              <Button className="bg-[#FFA500] hover:bg-[#FF8C00] text-black font-black px-12 py-6 text-lg rounded-md transition-all duration-200">
                OK
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SolutionSection() {
  const solutions = [
    {
      title: "Material Depot",
      icon: "/images/solutions/raw-material.svg",
      points: [
        "Centralized digital inventory hub",
        "Manufacturer-dealer-consumer bridge",
        "Assured availability with service linkage",
      ],
      modalHeading: "Material Depo in EBC (ECON Building Centre)",
      modalPoints: [
        {
          title: "Centralized digital inventory hub:",
          description: "A single, trusted marketplace where all building and construction materials—branded and local—are listed with standardized categories, pricing logic, GST, and availability across PAN-India.",
        },
        {
          title: "Direct manufacturer-dealer-consumer bridge:",
          description: "Eliminates ambiguity and middle-layer inefficiencies by connecting verified manufacturers, dealers, and local suppliers directly to end users with transparent specifications and supply options.",
        },
        {
          title: "Assured availability with service linkage:",
          description: "Ensures the right material is available at the right location, at the right time, and is seamlessly linked with related services (transport, installation, workers), reducing cost overruns and construction delays.",
        },
      ],
    },
    {
      title: "Technical Cabin",
      icon: "/images/solutions/technical-support.svg",
      points: [
        "Technical Support & Validation Hub",
        "Decision-Guidance for Users & Dealers",
        "Quality, Risk & Cost Control Layer of EBC",
      ],
      modalHeading: "\"Technical Cabin\" in the EBC context refers to a dedicated expert-support room/function (physical or digital) within the ECON Building Centre ecosystem. In three clear points:",
      modalPoints: [
        {
          title: "Central Technical Support & Validation Hub:",
          description: "A space where qualified engineers, architects, and technical experts verify drawings, material selections, BOQs, estimates, and construction methods to ensure technical correctness and compliance with standards.",
        },
        {
          title: "Decision-Guidance for Users & Dealers:",
          description: "Acts as a help desk for homeowners, contractors, and dealers to resolve doubts related to materials, specifications, quantities, workmanship, and cost optimization—reducing confusion and wrong decisions.",
        },
        {
          title: "Quality, Risk & Cost Control Layer of EBC:",
          description: "Functions as the technical backbone of EBC, preventing material mismatch, overconsumption, structural errors, and substandard execution, thereby protecting quality, safety, and budget across projects.",
        },
      ],
    },
    {
      title: "Manpower Hub",
      icon: "/images/solutions/workers.svg",
      points: [
        "Centralized Workforce Marketplace",
        "On-Demand Hiring & Scheduling Engine",
        "Payments & Performance Control",
      ],
      modalHeading: "Manpower Hub in the EBC platform can be expressed succinctly as follows:",
      modalPoints: [
        {
          title: "Centralized Workforce Marketplace:",
          description: "A dedicated EBC module where skilled, semi-skilled, and unskilled construction manpower (masons, electricians, plumbers, helpers, supervisors, etc.) are onboarded, verified, categorized, and made discoverable PAN-India.",
        },
        {
          title: "On-Demand Hiring & Scheduling Engine:",
          description: "Enables homeowners, contractors, and builders to search, compare, book, and schedule manpower based on skill type, location, availability, wage model (daily/hourly/job-based), and project duration.",
        },
        {
          title: "Governance, Payments & Performance Control:",
          description: "Provides admin-level control for worker verification, attendance tracking, standardized wage benchmarks, digital payments, ratings, and compliance—ensuring reliability, transparency, and accountability across all EBC projects.",
        },
      ],
    },
    {
      title: "Fabricator Area",
      icon: "/images/solutions/forklift.svg",
      points: [
        "Central hub for fabrication",
        "Job-to-fabricator matching & execution",
        "Quality, pricing, and compliance control",
      ],
      modalHeading: "Fabricator Area in the ECON Building Centre (EBC) refers to a dedicated functional zone within the platform for metal and structural fabrication-related activities.",
      modalPoints: [
        {
          title: "Central hub for fabrication services and materials:",
          description: "Lists fabricators (MS/SS/Aluminium), fabrication jobs (gates, grills, sheds, railings, staircases, structural frames) and the required raw materials (sections, sheets, pipes, fasteners) in one controlled area.",
        },
        {
          title: "Job-to-fabricator matching & execution flow:",
          description: "Enables customers, contractors, and dealers to post fabrication requirements, receive quotations, assign jobs to verified fabricators, track progress, and manage delivery/installation.",
        },
        {
          title: "Quality, pricing, and compliance control:",
          description: "Allows EBC to standardize rates, verify fabricator credentials, ensure material-grade compliance, and maintain workmanship quality across PAN-India projects.",
        },
      ],
    },
    {
      title: "Hiring Terminal",
      icon: "/images/solutions/recruiter.svg",
      points: [
        "Digital hiring space",
        "Centralized appointment",
        "Trust and control layer",
      ],
      modalHeading: "Hiring Terminal room in EBC can be expressed as:",
      modalPoints: [
        {
          title: "Digital hiring space:",
          description: "A dedicated digital hiring space within the EBC platform where customers, contractors, or dealers can search, compare, and book verified workers, technicians, and service providers based on skill, location, availability, and pricing.",
        },
        {
          title: "Centralized appointment:",
          description: "and allocation hub that manages real-time worker availability, job assignment, scheduling, attendance, and completion tracking, ensuring transparency and accountability for all parties.",
        },
        {
          title: "Trust and control layer:",
          description: "A trust and control layer of EBC that ensures background-verified manpower, standardized rates, digital job records, and dispute-resolution support, eliminating dependency on unorganized local labour networks.",
        },
      ],
    },
    {
      title: "Contract Desk",
      icon: "/images/solutions/contractor.svg",
      points: [
        "Centralized Negotiation & Finalization Hub",
        "End-to-End Contract Management",
        "Trust, Control & Risk Mitigation Layer",
      ],
      modalHeading: "Contract Desk room in EBC can be expressed succinctly as follows:",
      modalPoints: [
        {
          title: "Centralized Negotiation & Finalization Hub:",
          description: "A dedicated digital space where homeowners, contractors, service providers, and suppliers can negotiate scope, pricing, timelines, and terms, and formally finalize construction-related contracts within the EBC ecosystem.",
        },
        {
          title: "End-to-End Contract Management & Transparency:",
          description: "Enables structured documentation, approvals, milestones, payment schedules, and compliance tracking, ensuring clarity, accountability, and reduced disputes for all parties.",
        },
        {
          title: "Trust, Control & Risk Mitigation Layer:",
          description: "Acts as EBC's controlled assurance mechanism—linking verified vendors, standardized terms, and monitored execution—so projects move from quotation to completion with confidence and governance.",
        },
      ],
    },
    {
      title: "Offers Zone",
      icon: "/images/solutions/best-price.svg",
      points: [
        "Dedicated virtual meeting room",
        "Multi-party coordination",
        "Central record-backed collaboration space",
      ],
      modalHeading: "Offers Zone (EBC Platform) – Explained",
      modalPoints: [
        {
          title: "Dedicated virtual meeting room:",
          description: "A dedicated virtual meeting room within the EBC platform where homeowners, contractors, architects, engineers, and EBC advisors can meet together for structured discussions on projects, estimates, designs, and execution planning.",
        },
        {
          title: "Multi-party coordination:",
          description: "Used for multi-party coordination and decision-making, such as finalizing BOQs, comparing materials/brands, approving designs, resolving site issues, and aligning timelines—eliminating confusion and repeated site visits.",
        },
        {
          title: "Central record-backed collaboration space:",
          description: "Acts as a central record-backed collaboration space, where meeting outcomes, shared documents, cost approvals, and action points are documented for transparency, accountability, and smooth project execution.",
        },
      ],
    },
    {
      title: "Cost Calculator",
      icon: "/images/solutions/budget.svg",
      points: [
        "Construction Cost Estimation",
        "Intelligence for Budget Optimization",
        "Direct Action Enablement Inside Marketplace",
      ],
      modalHeading: "AI Cost Calculator in the ECON Building Centre (EBC) platform can be clearly expressed as follows:",
      modalPoints: [
        {
          title: "Automated, Item-wise Construction Cost Estimation:",
          description: "Uses AI to calculate accurate, location-adjusted construction cost by auto-mapping project inputs (built-up area, design type, floors, material grade, labour type) with EBC's real-time material prices, service rates, and worker charges available on the platform.",
        },
        {
          title: "Decision Intelligence for Budget Optimization:",
          description: "Instantly compares multiple scenarios (branded vs local materials, different construction methods, contractor vs worker-based execution) and shows cost savings, trade-offs, and optimized combinations—helping users control budget before money is spent.",
        },
        {
          title: "Direct Action Enablement Inside Marketplace:",
          description: "Converts the final cost estimate into a structured shopping + service plan, allowing users to directly purchase materials, book services/workers, and lock prices—eliminating guesswork, overbilling, and contractor dependency.",
        },
      ],
    },
    {
      title: "Service Support",
      icon: "/images/solutions/technical-support.svg",
      points: [
        "Mason, plumber, electrician, painter etc.",
        "Ratings & reviews",
        "Service oversight",
      ],
      modalHeading: "Service Support in EBC (ECON Building Centre)",
      modalPoints: [
        {
          title: "Verified Professionals at Your Fingertips:",
          description: "Access a curated list of verified masons, plumbers, electricians, painters, and other construction service providers, complete with ratings and reviews from previous projects.",
        },
        {
          title: "Transparent Pricing & Standardized Rates:",
          description: "Eliminate the hassle of negotiating by utilizing EBC's standardized rate benchmarks for various services, ensuring you pay a fair price for quality workmanship.",
        },
        {
          title: "Dedicated Support & Quality Assurance:",
          description: "Benefit from EBC's oversight and support system, designed to ensure that services are delivered to your satisfaction and that any issues are resolved promptly.",
        },
      ],
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden min-h-[900px]">
      {/* Background with Orange Tint */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/solutions/solution-backgrouond.jpg"
          alt="Solution Background"
          fill
          className="object-cover opacity-30"
          sizes="100vw"
          priority
        />
        {/* Warm Orange/Yellow Overlay - Lighter for more fade */}
        <div className="absolute inset-0 bg-[#FFA500]/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-b from-white/60 via-transparent to-white/60" />
      </div>

      <Container size="xl" className="relative z-10">
        <div className="text-center mb-16">
          <TypographyH1 className="text-[#445EB4] font-black text-3xl md:text-5xl drop-shadow-sm">
            EBC&apos;s Solution
          </TypographyH1>
          <p className="text-[#445EB4] font-bold text-lg md:text-xl mt-4 opacity-80">
            It&apos;s a Local Marketplace. No Commission. No Hidden Charges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {solutions.map((item, index) => (
            <SolutionCard
              key={index}
              title={item.title}
              icon={item.icon}
              points={item.points}
              modalHeading={item.modalHeading}
              modalPoints={item.modalPoints}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

