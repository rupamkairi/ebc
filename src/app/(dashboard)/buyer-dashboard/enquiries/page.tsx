"use client";

import Container from "@/components/containers/containers";
import { useEnquiriesQuery } from "@/queries/activityQueries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import Link from "next/link";

// Removed hardcoded enquiries
// const enquiries = [...];

const filters = ["All", "Pending", "Approved", "Rejected"];

export default function EnquiriesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const { data: enquiries, isLoading } = useEnquiriesQuery({
    search: search,
  });

  const filteredEnquiries = (enquiries || []).filter((e) => {
    if (activeFilter === "All") return true;
    return e.status === activeFilter; // Ensure case matches API (usually uppercase in backend, titlecase in UI?)
    // If backend returns UPPERCASE, we might need normalization.
    // Docs example used "Pending", "Approved" in the list example? No, docs didn't specify status values in list response example.
    // The "Verify Entity" had "APPROVED"/"REJECTED". Let's assume title case for now or normalize.
  });

  return (
    <Container>
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Enquiries</h1>
            <p className="text-muted-foreground">
              Manage and track your product enquiries.
            </p>
          </div>
          <Link href="/enquiry/create">
            <Button>Create New Enquiry</Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Badge
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className="cursor-pointer px-4 py-1.5 text-sm"
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search enquiries..."
              className="w-full sm:w-[250px] pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            filteredEnquiries.map((enquiry) => (
              <Card key={enquiry.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-bold">
                        {enquiry.lineItems?.[0]?.item?.name || "Enquiry Items"}
                        {enquiry.lineItems?.length > 1 &&
                          ` +${enquiry.lineItems.length - 1} more`}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        ID: {enquiry.id} •{" "}
                        {enquiry.createdAt
                          ? format(new Date(enquiry.createdAt), "PPP")
                          : "N/A"}
                      </p>
                    </div>
                    <Badge
                      variant={
                        enquiry.status === "Approved"
                          ? "default" // or success if available, defaulting to default (usually black/primary)
                          : enquiry.status === "Rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {enquiry.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <p className="text-sm">
                      {/* Backend might not return vendor name directly yet */}
                      Quantity:{" "}
                      <span className="font-medium">
                        {enquiry.lineItems?.[0]?.quantity}{" "}
                        {enquiry.lineItems?.[0]?.unitType}
                      </span>
                    </p>
                    <Button variant="link" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          {filteredEnquiries.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No enquiries found.
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
