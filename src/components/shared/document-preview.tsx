"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/authStore";
import { ADMIN_ROLES } from "@/constants/roles";
import { USER_ROLE } from "@/constants/enums";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";

interface DocumentPreviewProps {
  url: string;
  name: string;
  fileType?: string;
  children: React.ReactNode;
  className?: string;
}

export function DocumentPreview({
  url,
  name,
  fileType,
  children,
  className,
}: DocumentPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();

  const isAdmin = user && ADMIN_ROLES.includes(user.role as USER_ROLE);
  const isPdf =
    fileType?.toLowerCase() === "pdf" ||
    url.toLowerCase().endsWith(".pdf") ||
    url.toLowerCase().includes(".pdf?") ||
    url.toLowerCase().includes("/pdf"); // robust checking

  const handleClick = (e: React.MouseEvent) => {
    if (isAdmin && isPdf) {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(true);
    }
  };

  return (
    <>
      <div onClick={handleClick} className={className}>
        {children}
      </div>

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-4xl w-[90vw] h-[85vh] flex flex-col p-4 gap-4">
            <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b space-y-0">
              <div className="flex-1 min-w-0 pr-4">
                <DialogTitle className="text-lg font-bold truncate">
                  {name || "Document Preview"}
                </DialogTitle>
                <DialogDescription>
                  Admin Secure Preview - PDF Document
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2 shrink-0 pr-6">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(url, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </Button>
                <a href={url} download={name || "document.pdf"} target="_blank" rel="noreferrer">
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </a>
              </div>
            </DialogHeader>
            <div className="flex-1 w-full h-full min-h-0 bg-muted/20 rounded-lg overflow-hidden border">
              <iframe
                src={`${url}#toolbar=0`}
                className="w-full h-full border-none"
                title={name || "PDF Document Preview"}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
