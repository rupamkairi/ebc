"use client";

import { 
  Star, 
  Search, 
  Filter,
  MessageSquare,
  ThumbsUp,
  User,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const reviews = [
  {
    id: "REV-001",
    customer: "Rajesh Malhotra",
    rating: 5,
    comment: "Excellent service! The cement was delivered on time and the quality is top-notch. Highly recommended for bulk orders.",
    date: "24 Dec 2025",
    product: "Ultratech Cement",
    verified: true,
  },
  {
    id: "REV-002",
    customer: "Sanjay Gupta",
    rating: 4,
    comment: "Good experience overall. The bricks were good quality, although the delivery was delayed by a few hours. Communication was good.",
    date: "20 Dec 2025",
    product: "Red Bricks (Class A)",
    verified: true,
  },
  {
    id: "REV-003",
    customer: "Anjali Sharma",
    rating: 5,
    comment: "Very professional behavior. They helped me choose the right material for my home construction. Very satisfied with the price.",
    date: "15 Dec 2025",
    product: "TMT Steel Bars",
    verified: true,
  },
  {
    id: "REV-004",
    customer: "Vikram Singh",
    rating: 3,
    comment: "Prices are competitive but tracking the delivery was a bit difficult. Hope they improve the update system.",
    date: "10 Dec 2025",
    product: "Wall Tiles",
    verified: false,
  },
];

export default function ReviewsPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Customer Reviews
          </h1>
          <p className="text-foreground/60 font-medium">
            See what your customers are saying about your products and service.
          </p>
        </div>
        
        {/* Rating Summary Card */}
        <div className="bg-white p-4 rounded-2xl border border-border shadow-sm flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-black text-primary">4.8</div>
            <div className="flex text-secondary mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={14} className="fill-current" />
              ))}
            </div>
          </div>
          <div className="h-10 w-px bg-border hidden sm:block" />
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-foreground">124 Total Reviews</div>
            <div className="text-xs font-medium text-emerald-600">96% Positive Feedback</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
          <input 
            type="text" 
            placeholder="Search reviews..." 
            className="w-full bg-white border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl border-border h-12 px-4 shadow-sm bg-white">
            <ArrowUpDown size={18} className="mr-2" />
            Sort
          </Button>
          <Button variant="outline" className="rounded-xl border-border h-12 px-4 shadow-sm bg-white">
            <Filter size={18} className="mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid gap-4">
        {reviews.map((rev) => (
          <Card key={rev.id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground flex items-center gap-2">
                        {rev.customer}
                        {rev.verified && (
                          <span className="inline-flex items-center bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">
                            Verified
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-foreground/40 font-bold">{rev.date}</p>
                    </div>
                  </div>
                  <div className="flex text-secondary">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        size={16} 
                        className={s <= rev.rating ? "fill-current" : "text-muted"} 
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="inline-block bg-muted px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-2">
                    {rev.product}
                  </div>
                  <p className="text-foreground/80 font-medium leading-relaxed italic">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                  <button className="flex items-center gap-1.5 text-xs font-bold text-foreground/40 hover:text-primary transition-colors">
                    <ThumbsUp size={14} />
                    Helpful (0)
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-foreground/40 hover:text-primary transition-colors">
                    <MessageSquare size={14} />
                    Reply
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="ghost" className="w-full py-8 text-foreground/40 font-bold hover:text-primary group">
        Load More Reviews
        <ArrowUpDown size={16} className="ml-2 group-hover:rotate-180 transition-transform duration-500" />
      </Button>
    </div>
  );
}
