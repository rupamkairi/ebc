"use client";

import { 
  Phone, 
  Mail, 
  MessageCircle, 
  ChevronRight, 
  Clock,
  Send,
  FileQuestion,
  LifeBuoy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const faqs = [
  {
    q: "How do I update my product prices in bulk?",
    a: "You can go to 'My Catalog' and use the 'Bulk Update' feature to download your items as CSV, update the prices, and upload it back."
  },
  {
    q: "How long does it take to settle my payments?",
    a: "Payments are typically settled within 3-5 business days after the successful delivery and customer confirmation of the order."
  },
  {
    q: "What if a customer rejects the material upon delivery?",
    a: "In case of rejection, the material will be returned to your warehouse. You should contact our logistics partner or support team to file a claim if there was any damage during transit."
  },
  {
    q: "How can I increase my 'Vishwas Score'?",
    a: "The score is based on quick response times to enquiries, order fulfillment accuracy, and positive customer ratings. Replying faster usually yields 3X more business!"
  }
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-black text-foreground tracking-tight">
          Seller Help Center
        </h1>
        <p className="text-xl text-foreground/60 font-medium mt-2">
          Hum hain aapke saath, har kadam par. How can we help you today?
        </p>
      </div>

      {/* Quick Contact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group bg-emerald-50/50 border-emerald-100">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
              <MessageCircle size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-emerald-900 italic">WhatsApp Chat</h3>
              <p className="text-emerald-700/60 font-bold text-sm">Response in &lt; 5 mins</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group bg-blue-50/50 border-blue-100">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <Phone size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-blue-900 italic">Call Support</h3>
              <p className="text-blue-700/60 font-bold text-sm">9 AM - 8 PM daily</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer group bg-purple-50/50 border-purple-100">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="h-16 w-16 rounded-2xl bg-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-200 group-hover:scale-110 transition-transform">
              <Mail size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-purple-900 italic">Email Support</h3>
              <p className="text-purple-700/60 font-bold text-sm">support@ebc.com</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Raise a Ticket */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-secondary/10 p-2 rounded-lg">
              <LifeBuoy className="text-secondary" size={24} />
            </div>
            <h2 className="text-2xl font-black text-foreground">Submit a Ticket</h2>
          </div>
          
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40">Issue Category</label>
                  <select className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-bold">
                    <option>Payment Issue</option>
                    <option>Catalog/Price Update</option>
                    <option>Logistics/Delivery</option>
                    <option>Account Related</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-foreground/40">Describe your problem</label>
                  <textarea 
                    placeholder="Type your message here..."
                    className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 min-h-[120px] outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                  />
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center gap-3">
                  <Clock size={20} className="text-primary" />
                  <p className="text-sm font-bold text-primary/80">Average resolution time for tickets is 4-6 business hours.</p>
                </div>

                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-black py-6 rounded-xl text-lg shadow-lg shadow-secondary/20 group">
                  Send Support Request
                  <Send size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileQuestion className="text-primary" size={24} />
            </div>
            <h2 className="text-2xl font-black text-foreground">Common Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Card 
                key={i} 
                className={`border-none shadow-sm cursor-pointer transition-all ${openFaq === i ? 'ring-2 ring-primary/20 bg-white' : 'hover:bg-white/50'}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-bold text-foreground leading-snug">{faq.q}</h4>
                    <ChevronRight 
                      size={18} 
                      className={`text-foreground/20 transition-transform duration-300 ${openFaq === i ? 'rotate-90' : ''}`} 
                    />
                  </div>
                  {openFaq === i && (
                    <div className="mt-4 pt-4 border-t border-border/50 text-foreground/60 font-medium leading-relaxed italic animate-in slide-in-from-top-2 duration-300">
                      {faq.a}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm text-center space-y-4">
            <p className="text-sm font-bold text-foreground/60">Still have questions?</p>
            <Button variant="outline" className="rounded-full border-primary text-primary font-black px-8">
              View Full Knowledge Base
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
