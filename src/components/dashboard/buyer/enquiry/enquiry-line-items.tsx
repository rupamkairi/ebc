"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Package } from "lucide-react";
import { useEnquiryStore } from "@/store/enquiryStore";
import { UNIT_TYPE_LABELS } from "@/constants/quantities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EnquiryLineItems() {
  const { items, removeItem } = useEnquiryStore();

  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Selected Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Item</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.itemId}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="capitalize">{item.type}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  {item.unitType ? UNIT_TYPE_LABELS[item.unitType] : "-"}
                </TableCell>
                <TableCell
                  className="max-w-[200px] truncate"
                  title={item.remarks}
                >
                  {item.remarks || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    onClick={() => removeItem(item.itemId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
