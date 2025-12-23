"use client";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface ActionColumnProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ActionColumn({ onEdit, onDelete }: ActionColumnProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      {onEdit && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="text-primary hover:text-primary hover:bg-primary/10"
        >
          <Pencil className="size-4" />
          <span className="sr-only">Edit</span>
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="size-4" />
          <span className="sr-only">Delete</span>
        </Button>
      )}
    </div>
  );
}
