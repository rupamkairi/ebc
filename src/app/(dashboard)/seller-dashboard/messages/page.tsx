"use client";

import { 
  Search, 
  User, 
  MessageSquare, 
  Phone, 
  MoreVertical, 
  Send,
  Plus,
  ArrowLeft,
  Clock,
  CheckCheck
} from "lucide-react";
import { DashboardHeader } from "../dashboard-header";
import { BottomNav } from "../bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const contacts = [
  {
    id: 1,
    name: "Amit Sharma",
    avatar: "",
    lastMessage: "Sir, cement kab tak deliver hoga?",
    time: "10:30 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Priya Verma",
    avatar: "",
    lastMessage: "Thank you for the quote. Will let you know.",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Rahul Gupta",
    avatar: "",
    lastMessage: "Sample designs are very helpful.",
    time: "Wed",
    unread: 0,
    online: true,
  },
];

export default function MessagesPage() {
  const [selectedContact, setSelectedContact] = useState<typeof contacts[0] | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 h-[700px]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-foreground tracking-tight">Messages</h1>
            <Button className="rounded-2xl h-11 px-6 bg-secondary text-white font-black shadow-lg shadow-secondary/10 flex items-center gap-2">
              <Plus size={18} />
              New Chat
            </Button>
          </div>

          <Card className="flex-1 border-none shadow-sm overflow-hidden flex flex-col md:flex-row bg-white">
            {/* Sidebar / Contacts List */}
            <div className={`w-full md:w-80 border-r border-border flex flex-col ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search chats..." 
                    className="w-full bg-muted/50 border border-border rounded-xl py-2 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {contacts.map((contact) => (
                  <div 
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 flex items-center gap-4 cursor-pointer transition-colors ${
                      selectedContact?.id === contact.id ? 'bg-primary/5' : 'hover:bg-muted/30'
                    }`}
                  >
                    <div className="relative">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">
                        {contact.name.charAt(0)}
                      </div>
                      {contact.online && (
                        <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-foreground truncate">{contact.name}</h4>
                        <span className="text-[10px] font-bold text-foreground/30">{contact.time}</span>
                      </div>
                      <p className="text-xs font-medium text-foreground/50 truncate italic mt-0.5">
                        {contact.lastMessage}
                      </p>
                    </div>
                    {contact.unread > 0 && (
                      <div className="h-5 w-5 rounded-full bg-secondary text-white text-[10px] font-black flex items-center justify-center">
                        {contact.unread}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col bg-muted/10 ${!selectedContact ? 'hidden md:flex' : 'flex'}`}>
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 bg-white border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="md:hidden rounded-lg"
                        onClick={() => setSelectedContact(null)}
                      >
                        <ArrowLeft size={20} />
                      </Button>
                      <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center font-black">
                        {selectedContact.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground leading-none">{selectedContact.name}</h4>
                        <p className="text-[10px] font-bold text-emerald-500 mt-1 uppercase tracking-widest">
                          {selectedContact.online ? 'Online' : 'Recently Active'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="rounded-full text-foreground/30 hover:text-primary">
                        <Phone size={20} />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-full text-foreground/30 hover:text-primary">
                        <MoreVertical size={20} />
                      </Button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                    <div className="self-center bg-white/80 backdrop-blur-sm border border-border px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-foreground/30">
                      Today
                    </div>
                    
                    {/* Placeholder Messages */}
                    <div className="self-start max-w-[80%] bg-white border border-border p-4 rounded-2xl rounded-tl-none shadow-sm">
                      <p className="text-sm font-medium text-foreground/80 leading-relaxed italic">
                        {selectedContact.lastMessage}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[9px] font-bold text-foreground/20 italic">{selectedContact.time}</span>
                      </div>
                    </div>

                    <div className="self-end max-w-[80%] bg-primary text-white p-4 rounded-2xl rounded-tr-none shadow-lg shadow-primary/10">
                      <p className="text-sm font-bold leading-relaxed">
                        Ji, zarur. Humne aapka order process kar diya hai. Kal subah tak pahuch jayega.
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[9px] font-black italic opacity-60">10:45 AM</span>
                        <CheckCheck size={12} className="opacity-60" />
                      </div>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 bg-white border-t border-border">
                    <form 
                      className="flex items-center gap-3"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <input 
                        type="text" 
                        placeholder="Type a message..." 
                        className="flex-1 bg-muted/50 border border-border rounded-2xl py-3 px-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                      <Button className="h-12 w-12 rounded-2xl bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/10 shrink-0">
                        <Send size={20} className="ml-1" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-foreground/20">
                  <div className="h-24 w-24 rounded-3xl bg-muted flex items-center justify-center mb-6">
                    <MessageSquare size={48} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground/40">Select a conversation</h3>
                  <p className="text-sm font-medium max-w-xs mt-2 italic">Connect with your customers to grow your business.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
