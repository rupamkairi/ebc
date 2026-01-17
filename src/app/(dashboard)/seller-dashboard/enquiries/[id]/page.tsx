"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { activityService } from "@/services/activityService";
import { Enquiry } from "@/types/activity";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  FileText,
  Loader2,
  MapPin,
  MessageSquare,
  PackageCheck,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EnquiryDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiry = async () => {
      try {
        setLoading(true);
        const data = await activityService.getEnquiry(id);
        setEnquiry(data);
      } catch (error) {
        console.error("Error fetching enquiry:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEnquiry();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Enquiry not found.</p>
        <Button asChild variant="outline">
          <Link href="/seller-dashboard/enquiries">Back to Enquiries</Link>
        </Button>
      </div>
    );
  }

  const details = enquiry.enquiryDetails?.[0];

  // Mock data to match EnquiryDetailsView props
  const buyerDetails = {
    name: "Amit Sharma",
    phone: "+91 98765 43210",
    address: "Ring Road, Scheme 54",
    pincode: "452010",
    expectedDate: new Date("2025-12-23"),
    remarks: "Need delivery by tomorrow morning. Prefer local Indore dispatch.",
  };

  const items = [
    {
      name: "Cement",
      brandName: "Ultratech/ACC",
      quantity: 50,
      unit: "Bags",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/seller-dashboard/enquiries">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Enquiry Details</h1>
          <p className="text-sm text-muted-foreground">
            Review buyer requirements and submit your quotation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">
                  Buyer Requirements
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    ID: {enquiry.id.slice(0, 8)}
                  </Badge>
                  <Badge>{enquiry.status}</Badge>
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Submitted on</p>
                <p className="text-sm font-medium">
                  {format(new Date(enquiry.createdAt), "PPP")}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <PackageCheck className="h-5 w-5 text-primary" />
                  Items Requested
                </h3>
                <div className="grid gap-4">
                  {enquiry.enquiryLineItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-4 rounded-lg border bg-muted/20"
                    >
                      <div className="space-y-1">
                        <p className="font-bold">{item.item?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} {item.unitType}
                        </p>
                        {item.remarks && (
                          <p className="text-sm italic text-muted-foreground mt-2">
                            {item.remarks}
                          </p>
                        )}
                      </div>
                      {item.flexibleWithBrands && (
                        <Badge variant="secondary">Flexible with brands</Badge>
                      )}
                    </div>
                  ))}
                </div>
                <h1 className="text-3xl font-black text-foreground pt-2">
                  Requirement Details
                </h1>
              </div>
            </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Delivery Location
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {details?.address || "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Expected Delivery Date
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {details?.expectedDate
                      ? format(new Date(details.expectedDate), "PPP")
                      : "Not specified"}
                  </p>
                </div>
              </div>

              {details?.remarks && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Additional Remarks
                  </h3>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg italic">
                    {details.remarks}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Buyer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {enquiry.createdBy?.name?.charAt(0) || "B"}
                </div>
                <div>
                  <p className="font-bold leading-none">
                    {enquiry.createdBy?.name || "Anonymous Buyer"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {enquiry.createdBy?.role
                      ?.replace("USER_", "")
                      .toLowerCase()
                      .replace("_", " ")}
                  </p>
                </div>
              </div>
              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {enquiry.createdBy?.phone || "N/A"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle>Submit Quotation</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Ready to fulfill this requirement? Send your best price to the
                buyer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary" asChild>
                <Link
                  href={`/seller-dashboard/quotations/create?enquiryId=${enquiry.id}`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Create Quotation
                </Link>
              </Button>
            </CardContent>
          </Card>

          <div className="bg-muted p-4 rounded-lg flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Tip:</strong> Providing a quick response and accurate
              breakdown of costs increases your chances of selection by 60%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
