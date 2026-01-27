"use client";

import { useState } from "react";
import { 
  useSupportQueriesQuery, 
  useUpdateSupportQueryMutation 
} from "@/queries/supportQueries";
import { 
  Card, 
  CardContent, 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  MessageSquare, 
  Phone, 
  User, 
  CheckCircle2, 
  MoreVertical,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SupportChat } from "@/components/shared/support/support-chat";

export default function AdminSupportInbox() {
  const [statusFilter, setStatusFilter] = useState<string>("OPEN");
  const { data: queries, isLoading } = useSupportQueriesQuery(statusFilter);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const selectedTicket = ((queries as any)?.data || queries as any)?.find?.((q: any) => q.id === selectedTicketId);
  const updateMutation = useUpdateSupportQueryMutation(selectedTicketId || "");

  const handleUpdateStatus = async (status: string) => {
    if (!selectedTicketId) return;
    try {
      await updateMutation.mutateAsync({ status });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6 overflow-hidden">
      {/* Sidebar: List of Tickets */}
      <div className="w-1/3 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tickets..." className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="ASSIGNED">Assigned</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : ((queries as any)?.data || queries as any)?.length === 0 ? (
            <div className="text-center py-12 border rounded-xl bg-muted/20">
              <p className="text-sm text-muted-foreground">No tickets in this category.</p>
            </div>
          ) : (
            ((queries as any)?.data || queries as any)?.map?.((query: any) => (
              <Card 
                key={query.id}
                onClick={() => setSelectedTicketId(query.id)}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50 shadow-sm",
                  selectedTicketId === query.id ? "border-primary bg-primary/5 ring-1 ring-primary" : ""
                )}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-[10px]">{query.category?.name}</Badge>
                    <span className="text-[10px] text-muted-foreground">{new Date(query.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-semibold text-sm mb-1 line-clamp-1">{query.subject}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{query.createdBy?.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Main Content: Chat & Details */}
      <div className="flex-1 flex flex-col bg-card border rounded-2xl overflow-hidden shadow-xl">
        {selectedTicketId ? (
          <>
            {/* Header info for Admin */}
            <div className="p-4 border-b bg-muted/10 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {selectedTicket?.createdBy?.name?.[0] || "U"}
                </div>
                <div>
                  <h3 className="font-bold">{selectedTicket?.createdBy?.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <a href={`tel:${selectedTicket?.createdBy?.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                      <Phone className="h-3 w-3" />
                      {selectedTicket?.createdBy?.phone}
                    </a>
                    <span>•</span>
                    <span className="text-xs uppercase font-medium">{selectedTicket?.status}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedTicket?.status !== "RESOLVED" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => handleUpdateStatus("RESOLVED")}
                    disabled={updateMutation.isPending}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark Resolved
                  </Button>
                )}
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-hidden flex flex-col">
              <SupportChat ticketId={selectedTicketId} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-12 text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <MessageSquare className="h-10 w-10 opacity-20" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Support Command Center</h3>
            <p className="max-w-md">Select a support ticket from the list to start conversation with the user or resolve their issue.</p>
          </div>
        )}
      </div>
    </div>
  );
}
