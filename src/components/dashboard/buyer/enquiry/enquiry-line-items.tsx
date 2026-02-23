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
    <div className="rounded-[2.5rem] bg-white border border-[#3D52A0]/10 shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
      <div className="bg-[#3D52A0]/5 px-8 py-5 border-b border-[#3D52A0]/10 flex items-center gap-3">
        <Package className="w-6 h-6 text-[#3D52A0]" />
        <h3 className="text-xl font-black italic tracking-tighter text-[#3D52A0] uppercase">Selected Items</h3>
      </div>
      <div className="p-4 sm:p-8">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-[#3D52A0]/10 hover:bg-transparent">
                <TableHead className="text-[#3D52A0]/40 font-black text-[10px] tracking-widest uppercase">Item</TableHead>
                <TableHead className="text-[#3D52A0]/40 font-black text-[10px] tracking-widest uppercase text-center">Type</TableHead>
                <TableHead className="text-[#3D52A0]/40 font-black text-[10px] tracking-widest uppercase text-center">Quantity</TableHead>
                <TableHead className="text-[#3D52A0]/40 font-black text-[10px] tracking-widest uppercase text-center">Unit</TableHead>
                <TableHead className="text-[#3D52A0]/40 font-black text-[10px] tracking-widest uppercase">Remarks</TableHead>
                <TableHead className="text-[#3D52A0]/40 font-black text-[10px] tracking-widest uppercase text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.itemId} className="border-b-[#3D52A0]/5 hover:bg-[#3D52A0]/5 transition-colors group">
                  <TableCell className="font-bold text-[#3D52A0] py-6">{item.title}</TableCell>
                  <TableCell className="text-center py-6">
                    <span className="bg-[#3D52A0]/10 text-[#3D52A0] px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter italic">
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-center font-black text-[#3D52A0] text-lg py-6">{item.quantity}</TableCell>
                  <TableCell className="text-center text-[#3D52A0]/60 font-bold py-6">
                    {item.unitType ? UNIT_TYPE_LABELS[item.unitType] : "-"}
                  </TableCell>
                  <TableCell
                    className="max-w-[150px] truncate text-[#3D52A0]/80 font-medium py-6"
                    title={item.remarks}
                  >
                    {item.remarks || "-"}
                  </TableCell>
                  <TableCell className="text-right py-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#3D52A0]/20 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all h-10 w-10 group-hover:text-[#3D52A0]/40"
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
