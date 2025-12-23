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
        size === "sm" && "max-w-2xl",
        size === "md" && "max-w-4xl",
        size === "lg" && "max-w-6xl",
        // size === "lg" && "max-w-8xl" something liike this is needed.,
        "px-responsive"
      )}
    >
      {children}
    </div>
  );
}
