"use client";

import { useEnquiryStore } from "../../store/enquiry-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User, MapPin, CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { StyledCard } from "@/components/ui/styled-card";

export function BuyerDetailsForm() {
  const { buyerDetails, updateBuyerDetails, setStep } = useEnquiryStore();

  // Mock checking for active session (replace with actual auth hook later)
  const activeSession = false; // TODO: Integrate useAuthStore

  const handleNext = () => {
    // Basic validation
    if (!buyerDetails.pincode || !buyerDetails.expectedDate) {
      // toast.error("Please fill in mandatory fields");
      return;
    }
    setStep(2);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StyledCard
        title="Buyer Details"
        description="Tell us who you are and where you need the materials."
        icon={User}
        className="border-none shadow-lg"
      >
        <div className="space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={buyerDetails.name}
                onChange={(e) => updateBuyerDetails({ name: e.target.value })}
                readOnly={activeSession} // If session exists, maybe read-only or prefilled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+91 98765 43210"
                value={buyerDetails.phone}
                onChange={(e) => updateBuyerDetails({ phone: e.target.value })}
                readOnly={activeSession}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={buyerDetails.email || ""}
                onChange={(e) => updateBuyerDetails({ email: e.target.value })}
                readOnly={activeSession}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (Optional)</Label>
            <Textarea
              id="address"
              placeholder="Building No, Street Area"
              value={buyerDetails.address || ""}
              onChange={(e) => updateBuyerDetails({ address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pincode" className="flex items-center gap-2">
                Delivery Pincode <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="pincode"
                  placeholder="Enter Pincode"
                  value={buyerDetails.pincode}
                  onChange={(e) =>
                    updateBuyerDetails({ pincode: e.target.value })
                  }
                  maxLength={6}
                  className="pl-9"
                />
                <MapPin className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              </div>
              {/* Preview State/District - Mocked for now */}
              {buyerDetails.pincode.length === 6 && (
                <p className="text-xs text-muted-foreground mt-1 ml-1 flex items-center gap-1">
                  Looking good! Delivering to{" "}
                  <span className="font-semibold text-primary">
                    Maharashtra, Mumbai
                  </span>
                </p>
              )}
            </div>

            <div className="space-y-2 flex flex-col">
              <Label className="flex items-center gap-2">
                Expected Delivery Date{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !buyerDetails.expectedDate && "text-muted-foreground"
                    )}
                  >
                    {buyerDetails.expectedDate ? (
                      format(buyerDetails.expectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={buyerDetails.expectedDate}
                    onSelect={(date) =>
                      updateBuyerDetails({ expectedDate: date })
                    }
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              placeholder="Any specific delivery instructions?"
              value={buyerDetails.remarks || ""}
              onChange={(e) => updateBuyerDetails({ remarks: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Attachments (Optional)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <Upload className="size-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">
                Click to upload documents or media
              </p>
              <p className="text-xs text-muted-foreground">
                Support JPG, PNG, PDF
              </p>
            </div>
          </div>
        </div>
      </StyledCard>

      <div className="flex justify-end bg-white p-4 rounded-xl shadow-sm border">
        <Button
          onClick={handleNext}
          size="lg"
          className="w-full md:w-auto font-bold bg-secondary hover:bg-secondary/90 text-white rounded-lg"
        >
          Next: Add Items
        </Button>
      </div>
    </div>
  );
}
