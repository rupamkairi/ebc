import { twJoin } from "tailwind-merge";

type Props = {
  size?: "md" | "sm" | "lg" | "xl";
  children?: React.ReactNode;
  className?: string;
};

export default function Container({ size, children, className }: Props) {
  return (
    <div
      className={twJoin(
        "mx-auto",
        !size && "container",
        size === "sm" && "max-w-2xl",
        size === "md" && "max-w-4xl",
        size === "lg" && "max-w-6xl",
        size === "xl" && "max-w-7xl",
        "px-responsive",
        className
      )}
    >
      {children}
    </div>
  );
}
