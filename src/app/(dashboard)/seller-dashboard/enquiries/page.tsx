"use client";

import { Search, ChevronRight, Calendar, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useEntitiesQuery } from "@/queries/entityQueries";
import { useAssignmentsQuery } from "@/queries/activityQueries";
import { ActivityAssignment } from "@/types/activity";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UNIT_TYPE_LABELS, UnitType } from "@/constants/quantities";
import { ACTIVITY_TYPE } from "@/constants/enums";

export default function EnquiriesPage() {
  const { data: entities = [] } = useEntitiesQuery();
  const mainEntity = entities[0];

  const { data: assignments = [], isLoading: loading } = useAssignmentsQuery({
    toEntityId: mainEntity?.id,
    type: ACTIVITY_TYPE.ENQUIRY_ASSIGNMENT,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "APPROVED":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "REJECTED":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Active Enquiries
          </h1>
          <p className="text-muted-foreground">
            Manage and respond to enquiries from potential buyers.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search enquiries..."
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {assignments.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex h-[200px] items-center justify-center">
              <p className="text-muted-foreground">
                No enquiries assigned yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          assignments.map((assignment) => {
            const enq = assignment.enquiry;
            if (!enq) return null;

            const firstItem = enq.enquiryLineItems?.[0];
            const details = enq.enquiryDetails?.[0];

            return (
              <Card
                key={assignment.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3 border-b bg-muted/5">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px]"
                        >
                          ID: {enq.id.slice(0, 8)}
                        </Badge>
                        {enq.status === "PENDING" && (
                          <Badge className="bg-amber-500 hover:bg-amber-600">
                            New
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">
                        {enq.createdBy?.name || "Anonymous Buyer"}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        {details?.address && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {details.address}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {format(new Date(enq.createdAt), "PPP")}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(enq.status || "PENDING")}>
                      {enq.status || "PENDING"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Requirement
                      </p>
                      <p className="text-base font-semibold">
                        {firstItem?.item?.name || "Enquiry Items"}{" "}
                        {enq?.enquiryLineItems?.length > 1
                          ? `(+${enq.enquiryLineItems.length - 1} more)`
                          : ""}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {firstItem?.quantity}{" "}
                        {firstItem?.unitType &&
                          UNIT_TYPE_LABELS[firstItem.unitType as UnitType]}{" "}
                        requested
                      </p>
                    </div>
                    <Button asChild>
                      <Link href={`/seller-dashboard/enquiries/${enq.id}`}>
                        {enq.status === "PENDING" ? "Respond" : "View Details"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
