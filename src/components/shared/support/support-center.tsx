"use client";

import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  MessageCircle, 
  ArrowLeft, 
  ChevronRight, 
  Send,
  Loader2,
  Phone,
  Clock
} from "lucide-react";
import { 
  useSupportCategoriesQuery, 
  useSupportQueriesQuery, 
  useCreateSupportQueryMutation 
} from "@/queries/supportQueries";
import { 
  SupportCategory 
} from "@/types/support";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SupportChat } from "@/components/shared/support/support-chat";
import { useAuthStore } from "@/store/authStore";

export function SupportCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const token = useAuthStore((state) => state.token);
  const [view, setView] = useState<"HOME" | "CATEGORIES" | "FAQ" | "NEW_TICKET" | "MY_TICKETS" | "CHAT">("HOME");
  const [selectedCategory, setSelectedCategory] = useState<SupportCategory | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const { data: categories, isLoading: loadingCats } = useSupportCategoriesQuery(!!token);
  const { data: myTickets, isLoading: loadingTickets } = useSupportQueriesQuery(undefined, !!token);
  const createMutation = useCreateSupportQueryMutation();

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateTicket = async () => {
    if (!subject || !description || !selectedCategory) return;
    try {
      const ticket = await createMutation.mutateAsync({
        categoryId: selectedCategory.id,
        subject,
        description,
      });
      setSelectedTicketId(ticket.id);
      setView("CHAT");
      setSubject("");
      setDescription("");
    } catch (error) {
      console.error(error);
    }
  };

  const renderContent = () => {
    switch (view) {
      case "HOME":
        return (
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all text-primary"
                onClick={() => setView("CATEGORIES")}
              >
                <HelpCircle className="h-6 w-6" />
                <span>New Support Ticket</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center gap-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-blue-600"
                onClick={() => setView("MY_TICKETS")}
              >
                <Clock className="h-6 w-6" />
                <span>My Active Queries</span>
                {myTickets && myTickets.length > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {myTickets.length}
                  </Badge>
                )}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-3">Quick Help</h4>
              <p className="text-xs text-muted-foreground mb-4">
                Our support team is available Mon-Fri, 9am - 6pm.
              </p>
              <div className="space-y-2">
                <a href="tel:+918800000000" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted text-sm transition-colors">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span>Call Executive Directly</span>
                </a>
              </div>
            </div>
          </div>
        );

      case "CATEGORIES":
        return (
          <div className="space-y-4 pt-4">
            <Button variant="ghost" size="sm" onClick={() => setView("HOME")} className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <h3 className="font-semibold text-lg">What do you need help with?</h3>
            <div className="grid grid-cols-1 gap-2">
              {loadingCats ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (
                categories?.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setView("FAQ");
                    }}
                    className="flex items-center justify-between p-4 rounded-xl border hover:border-primary hover:bg-primary/5 transition-all text-left"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{cat.name}</span>
                      <span className="text-xs text-muted-foreground">{cat.description}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))
              )}
            </div>
          </div>
        );

      case "FAQ":
        return (
          <div className="space-y-4 pt-4">
            <Button variant="ghost" size="sm" onClick={() => setView("CATEGORIES")} className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <h3 className="font-semibold text-lg">{selectedCategory?.name} - FAQs</h3>
            <div className="space-y-3">
              {selectedCategory?.faqs?.map((faq) => (
                <div key={faq.id} className="p-4 rounded-lg bg-muted/50 border">
                  <p className="font-medium text-sm mb-2 text-primary">{faq.question}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
              <div className="pt-6 border-t mt-6">
                <p className="text-sm font-medium mb-3">Didn&apos;t find an answer?</p>
                <Button className="w-full gap-2" onClick={() => setView("NEW_TICKET")}>
                  <MessageCircle className="h-4 w-4" />
                  Open a Support Ticket
                </Button>
              </div>
            </div>
          </div>
        );

      case "NEW_TICKET":
        return (
          <div className="space-y-4 pt-4">
            <Button variant="ghost" size="sm" onClick={() => setView("FAQ")} className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <h3 className="font-semibold text-lg">Open a New Ticket</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic / Subject</label>
                <Input 
                  placeholder="Summarize your issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Detailed Description</label>
                <Textarea 
                  placeholder="Describe the problem in detail..."
                  className="min-h-[150px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button 
                className="w-full py-6 text-lg shadow-lg" 
                onClick={handleCreateTicket}
                disabled={createMutation.isPending || !subject || !description}
              >
                {createMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Send className="h-5 w-5 mr-2" />}
                Submit Ticket
              </Button>
            </div>
          </div>
        );

      case "MY_TICKETS":
        return (
          <div className="space-y-4 pt-4">
            <Button variant="ghost" size="sm" onClick={() => setView("HOME")} className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <h3 className="font-semibold text-lg">My Support Tickets</h3>
            <div className="space-y-2">
              {loadingTickets ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : (myTickets?.length === 0) ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No active tickets found.</p>
                </div>
              ) : (
                myTickets?.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => {
                      setSelectedTicketId(ticket.id);
                      setView("CHAT");
                    }}
                    className="flex flex-col w-full p-4 rounded-xl border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={cn(
                        ticket.status === "RESOLVED" ? "bg-green-100 text-green-700" :
                        ticket.status === "OPEN" ? "bg-blue-100 text-blue-700" :
                        "bg-orange-100 text-orange-700"
                      )}>
                        {ticket.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : ""}</span>
                    </div>
                    <span className="font-semibold group-hover:text-primary transition-colors">{ticket.subject}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{ticket.description}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        );

      case "CHAT":
        return (
          <div className="h-full flex flex-col">
            <Button variant="ghost" size="sm" onClick={() => setView("MY_TICKETS")} className="mb-2 self-start">
              <ArrowLeft className="h-4 w-4 mr-2" /> All Tickets
            </Button>
            <SupportChat ticketId={selectedTicketId!} />
          </div>
        );
    }
  };

  return (
    <>
      <div className="fixed bottom-8 left-8 z-50">
        <Button 
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-2xl bg-primary hover:scale-105 transition-transform"
        >
          <HelpCircle className="h-8 w-8" />
        </Button>
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[450px] p-6 overflow-y-auto">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              EBC Support Center
            </SheetTitle>
            <SheetDescription>
              We&apos;re here to help you grow your business.
            </SheetDescription>
          </SheetHeader>
          
          {renderContent()}
        </SheetContent>
      </Sheet>
    </>
  );
}
