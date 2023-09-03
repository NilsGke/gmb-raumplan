import { twMerge } from "tailwind-merge";

export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={twMerge(
        "flex aspect-square items-center justify-center",
        className,
      )}
    >
      <div className="h-full w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
    </div>
  );
}
