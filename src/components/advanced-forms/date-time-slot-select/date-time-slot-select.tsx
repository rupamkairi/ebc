"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { TimeSlot } from "@/store/appointmentStore";
import { nanoid } from "nanoid";

interface DateTimeSlotSelectProps {
  timeSlots: TimeSlot[];
  onAddSlot: (slot: TimeSlot) => void;
  onRemoveSlot: (id: string) => void;
}

export function DateTimeSlotSelect({
  timeSlots,
  onAddSlot,
  onRemoveSlot,
}: DateTimeSlotSelectProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const handleAddSlot = () => {
    if (!date) {
      toast.error("Please select a date.");
      return;
    }

    if (timeSlots.length >= 3) {
      toast.error("You can maintain a maximum of 3 preferred slots.");
      return;
    }

    // Validation: Duration <= 4 hours
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    const diffHours = (end.getTime() - start.getTime()) / 1000 / 60 / 60;

    if (diffHours <= 0) {
      toast.error("End time must be after start time.");
      return;
    }

    if (diffHours > 4) {
      toast.error("Time slot cannot exceed 4 hours.");
      return;
    }

    onAddSlot({
      id: nanoid(),
      date: date,
      startTime,
      endTime,
    });
    // Optional: Reset times?
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Preferred Time Slots (Max 3)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Area */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="space-y-2 flex-1">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2 w-full md:w-32">
            <Label>Start Time</Label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="space-y-2 w-full md:w-32">
            <Label>End Time</Label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <Button onClick={handleAddSlot} disabled={timeSlots.length >= 3}>
            <Plus className="h-4 w-4 mr-2" /> Add Slot
          </Button>
        </div>

        {/* List of Slots */}
        <div className="space-y-3">
          {timeSlots.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
              No time slots added yet. Please add at least one preferred slot.
            </p>
          )}
          {timeSlots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between p-3 border rounded-md bg-secondary/20"
            >
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">
                  {format(new Date(slot.date), "PPP")}
                </span>
                <div className="h-4 w-px bg-muted-foreground/30" />
                <span className="text-sm">
                  {slot.startTime} - {slot.endTime}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onRemoveSlot(slot.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
