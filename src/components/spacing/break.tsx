import { twJoin } from "tailwind-merge";

type Props = {
  className?: string;
};

export default function Break({ className }: Props) {
  return (
    <div className={twJoin("h-4 sm:h-6 md:h-8 lg:h-10 xl:h-12", className)} />
  );
}
