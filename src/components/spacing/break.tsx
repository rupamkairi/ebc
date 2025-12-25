import { twJoin } from "tailwind-merge";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
};

export default function Break({ className, size }: Props) {
  return (
    <div
      className={twJoin(
        !size && "h-4 sm:h-6 md:h-8 lg:h-10 xl:h-12",
        size === "sm" && "h-4",
        size === "md" && "h-8",
        size === "lg" && "h-12",
        size === "xl" && "h-16",
        className
      )}
    />
  );
}
