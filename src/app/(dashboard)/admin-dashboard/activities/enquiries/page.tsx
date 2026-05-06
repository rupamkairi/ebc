"use client";

import {
  useEnquiriesQuery,
  useQuotationsQuery,
} from "@/queries/activityQueries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Filter, Eye } from "lucide-react";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ENQUIRY_STATUS, ENQUIRY_STATUS_LABELS } from "@/constants/enums";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/containers";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ActivityDetailModal } from "@/components/dashboard/admin/activities/activity-detail-modal";

export default function AdminEnquiriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: enquiries = [], isLoading: loadingEnquiries } =
    useEnquiriesQuery();
  const { data: allQuotations = [], isLoading: loadingQuotations } =
    useQuotationsQuery();

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((enq) => {
      const q = searchQuery.toLowerCase();
      return (
        enq.id.toLowerCase().includes(q) ||
        enq.createdBy?.name?.toLowerCase().includes(q) ||
        enq.enquiryLineItems.some((li) =>
          li.item?.name?.toLowerCase().includes(q),
        )
      );
    });
  }, [enquiries, searchQuery]);

  if (loadingEnquiries || loadingQuotations) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Container className="py-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-primary">
          Platform Enquiries
        </h1>
        <p className="text-muted-foreground font-medium">
          Monitor all buyer enquiries and seller responses across the platform.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-primary/10 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
          <Input
            placeholder="Search by ID, Buyer, or Item..."
            className="pl-10 bg-slate-50/50 border-primary/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none gap-2">
            <Filter size={16} />
            Filters
          </Button>
        </div>
      </div>

      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-bold">Enquiry ID</TableHead>
              <TableHead className="font-bold">Buyer</TableHead>
              <TableHead className="font-bold">Items</TableHead>
              <TableHead className="font-bold">Responses</TableHead>
              <TableHead className="font-bold">Date</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="text-right font-bold">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnquiries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground"
                >
                  No enquiries found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEnquiries.map((enq) => {
                const quotations = allQuotations.filter(
                  (q) => q.enquiryId === enq.id,
                );
                return (
                  <TableRow
                    key={enq.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-primary/70">
                      #{enq.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">
                          {enq.createdBy?.name || "Anonymous"}
                        </span>
                        <span className="text-[10px] text-muted-foreground  ">
                          {enq.createdBy?.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">
                          {enq.enquiryLineItems[0]?.item?.name || "Items"}
                        </span>
                        {enq.enquiryLineItems.length > 1 && (
                          <span className="text-[10px] text-primary/40 font-bold ">
                            + {enq.enquiryLineItems.length - 1} more items
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={quotations.length > 0 ? "default" : "outline"}
                        className={cn(
                          "font-black text-[10px] px-2.5 py-0.5 rounded-full",
                          quotations.length > 0
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                            : "text-slate-400 border-slate-200",
                        )}
                      >
                        {quotations.length}{" "}
                        {quotations.length === 1 ? "Response" : "Responses"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(enq.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "font-black text-[9px]   px-2 py-0.5",
                          enq.status === ENQUIRY_STATUS.PENDING &&
                            "bg-amber-100 text-amber-700 hover:bg-amber-100",
                          enq.status === ENQUIRY_STATUS.APPROVED &&
                            "bg-sky-100 text-sky-700 hover:bg-sky-100",
                          enq.status === ENQUIRY_STATUS.COMPLETED &&
                            "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
                          (enq.status === ENQUIRY_STATUS.CANCELLED ||
                            enq.status === ENQUIRY_STATUS.REJECTED) &&
                            "bg-gray-100 text-gray-700 hover:bg-gray-100",
                        )}
                      >
                        {enq.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="font-black text-[10px]   h-8 px-4 rounded-lg hover:bg-primary hover:text-white transition-all"
                        onClick={() => {
                          setSelectedEnquiry(enq);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye size={16} className="text-primary/60" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      <ActivityDetailModal
        type="ENQUIRY"
        activity={selectedEnquiry}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEnquiry(null);
        }}
        quotations={
          selectedEnquiry
            ? allQuotations.filter((q) => q.enquiryId === selectedEnquiry.id)
            : []
        }
      />
    </Container>
  );
}
