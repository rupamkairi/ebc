import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TypographyResponsiveSmall } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode } from "react";

interface DisplayCardProps {
  image: string;
  title: string;
  aspectRatio?: "video" | "square" | "4/3" | "3/2";
  floatingIcon?: ReactNode;
  className?: string;
  contentClassName?: string;
  footerClassName?: string;
  imageClassName?: string;
}

export function DisplayCard({
  image,
  title,
  aspectRatio = "video",
  floatingIcon,
  className,
  contentClassName,
  footerClassName,
  imageClassName,
}: DisplayCardProps) {
  const aspectClass = {
    video: "aspect-video",
    square: "aspect-square",
    "4/3": "aspect-4/3",
    "3/2": "aspect-3/2",
  };

  return (
    <Card
      className={cn(
        "py-0 gap-0 justify-between overflow-hidden border-none shadow-md rounded-2xl group cursor-pointer hover:shadow-xl transition-all duration-300 h-full flex flex-col",
        className
      )}
    >
      <CardContent
        className={cn("p-0 grow relative bg-slate-50", contentClassName)}
      >
        <div className={cn("relative w-full h-full", aspectClass[aspectRatio])}>
          <Image
            src={image}
            alt={title}
            fill
            unoptimized
            className={cn(
              "object-center object-cover transition-transform duration-500 scale-100 group-hover:scale-120",
              imageClassName
            )}
          />
          {floatingIcon && (
            <div className="absolute -bottom-5 left-5 size-10 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-100 text-xl z-10">
              {floatingIcon}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter
        className={cn(
          "inner-p bg-white text-center flex items-center justify-center min-h-20 z-[5]",
          footerClassName
        )}
      >
        <TypographyResponsiveSmall className="font-semibold leading-tight group-hover:text-primary transition-all">
          {title}
        </TypographyResponsiveSmall>
      </CardFooter>
    </Card>
  );
}
