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

export function EnquiryLineItems() {
  const { items, removeItem } = useEnquiryStore();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[2.5rem] bg-white border border-primary/10 shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
      <div className="bg-primary/5 px-8 py-5 border-b border-primary/10 flex items-center gap-3">
        <Package className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-bold tracking-tight text-primary">
          Selected Items
        </h3>
      </div>
      <div className="p-4 sm:p-8">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-primary/10 hover:bg-transparent">
                <TableHead className="text-primary/60 font-semibold text-xs text-left">
                  Item
                </TableHead>
                <TableHead className="text-primary/60 font-semibold text-xs text-center">
                  Type
                </TableHead>
                <TableHead className="text-primary/60 font-semibold text-xs text-center">
                  Quantity
                </TableHead>
                <TableHead className="text-primary/60 font-semibold text-xs text-center">
                  Unit
                </TableHead>
                <TableHead className="text-primary/60 font-semibold text-xs">
                  Remarks
                </TableHead>
                <TableHead className="text-primary/60 font-semibold text-xs text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow
                  key={item.itemId}
                  className="border-b-primary/5 hover:bg-primary/5 transition-colors group"
                >
                  <TableCell className="font-bold text-primary py-6">
                    {item.title}
                  </TableCell>
                  <TableCell className="text-center py-6">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-bold text-primary text-lg py-6">
                    {item.quantity}
                  </TableCell>
                  <TableCell className="text-center text-primary/60 font-bold py-6">
                    {item.unitType ? UNIT_TYPE_LABELS[item.unitType] : "-"}
                  </TableCell>
                  <TableCell
                    className="max-w-[150px] truncate text-primary/80 font-medium py-6"
                    title={item.remarks}
                  >
                    {item.remarks || "-"}
                  </TableCell>
                  <TableCell className="text-right py-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary/20 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all h-10 w-10 group-hover:text-primary/40"
                      onClick={() => removeItem(item.itemId)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
