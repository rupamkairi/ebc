"use client";

import React, { type SyntheticEvent } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CropIcon, Trash2Icon } from "lucide-react";

import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  onCropComplete: (imageBlob: Blob) => void;
  aspect?: number;
}

export function ImageCropper({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete,
  aspect = 1,
}: ImageCropperProps) {
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = React.useState<Crop>();
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>();

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  }

  async function handleCrop() {
    if (imgRef.current && completedCrop) {
      const blob = await getCroppedImg(imgRef.current, completedCrop);
      if (blob) {
        onCropComplete(blob);
        onOpenChange(false);
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="p-6 flex items-center justify-center bg-muted/50 max-h-[70vh] overflow-auto">
          {imageSrc && (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              className="max-w-full"
            >
              <img
                ref={imgRef}
                alt="Crop preview"
                src={imageSrc}
                onLoad={onImageLoad}
                className="max-w-full"
              />
            </ReactCrop>
          )}
        </div>
        <DialogFooter className="p-6 pt-4 flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            <Trash2Icon className="mr-2 size-4" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleCrop}>
            <CropIcon className="mr-2 size-4" />
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop
): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve(blob);
      },
      "image/jpeg",
      1.0
    );
  });
}
