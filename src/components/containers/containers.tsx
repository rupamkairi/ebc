import { twJoin } from "tailwind-merge";

type Props = {
  size?: "md" | "sm" | "lg";
  children?: React.ReactNode;
};

export default function Container({ size, children }: Props) {
  return (
    <div
      className={twJoin(
        "mx-auto",
        !size && "container",
        size === "md" && "max-w-lg",
        size === "sm" && "max-w-xl",
        size === "lg" && "max-w-4xl",
        "px-responsive"
      )}
    >
      {children}
    </div>
  );
}
