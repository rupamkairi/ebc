"use client";

import { AppointmentItemWrapper } from "@/components/dashboard/buyer/appointment/appointment-item-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppointmentStore } from "@/store/appointmentStore";
import { Package, Trash2 } from "lucide-react";

export function AppointmentLineItemWrapper() {
  const { item, setAppointmentItem } = useAppointmentStore();

  if (!item) {
    // If no item, show the Search Wrapper directly
    return <AppointmentItemWrapper />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Selected Item
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 border rounded-md">
          <div>
            <h4 className="font-semibold text-lg">{item.title}</h4>
            <p className="text-sm text-muted-foreground">
              Type: <span className="capitalize">{item.type}</span>
            </p>
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {item.description}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setAppointmentItem(null)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
