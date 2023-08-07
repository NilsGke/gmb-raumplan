import { twMerge } from "tailwind-merge";

export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      className={twMerge(
        "aspect-square flex justify-center items-center",
        className
      )}
    >
      <div className="animate-spin rounded-full h-full w-32 border-b-2 border-gray-900"></div>
    </div>
  );
}
