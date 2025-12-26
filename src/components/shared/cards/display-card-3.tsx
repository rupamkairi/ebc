import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { TypographyLarge } from "@/components/ui/typography";
import Image from "next/image";
import Link from "next/link";

import React from "react";
import { twJoin } from "tailwind-merge";

interface DisplayCard3Props {
  className?: string;
  iconURL: string;
  title: string;
  items: {
    iconURL?: string;
    icon?: React.ReactNode;
    label: string;
  }[];
  buttonLink: string;
  buttonTitle: string;
}

export function DisplayCard3({
  className,
  iconURL,
  title,
  items,
  buttonLink,
  buttonTitle,
}: DisplayCard3Props) {
  return (
    <Card
      className={twJoin(
        "bg-white shadow-lg border-none rounded-3xl h-full",
        className
      )}
    >
      <CardHeader>
        <div className="flex justify-center items-center">
          {iconURL && (
            <Image
              src={iconURL}
              className="object-contain"
              width={64}
              height={64}
              alt="Card Image"
            />
          )}
        </div>
        <TypographyLarge className="font-black text-center">
          {title}
        </TypographyLarge>
      </CardHeader>
      <CardContent className="grow">
        <div className="flex-2 text-sm font-semibold">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              {item.iconURL && (
                <Image
                  src={item.iconURL}
                  width={28}
                  height={28}
                  alt="Icon Image"
                />
              )}
              {item.icon && <div className="text-primary">{item.icon}</div>}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={buttonLink}>
          <Button
            className="inline-flex h-full py-2 whitespace-normal "
            size="sm"
          >
            {buttonTitle}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
