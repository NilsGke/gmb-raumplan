import { ReactNode } from "react";
import useKeyboard from "../hooks/useKeybaord";
import { twMerge } from "tailwind-merge";
import CloseIcon from "@assets/close.svg";

export default function Popup({
  children,
  title,
  open,
  close,
}: {
  children: ReactNode;
  title: string;
  open: boolean;
  close: () => void;
}) {
  useKeyboard((key) => key === "Escape" && close());

  return (
    <div
      className={twMerge(
        "pointer-events-none fixed left-0 top-0 flex h-full w-full items-center justify-center opacity-0 backdrop-blur-sm backdrop-brightness-50 transition-opacity",
        open && " pointer-events-auto z-50 opacity-100",
      )}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="relative max-w-[90%] rounded-3xl bg-white p-5">
        <button
          className="absolute right-5 top-5 flex aspect-square h-7 w-7 items-center justify-center"
          onClick={() => close()}
          title="schließen"
        >
          <img className="aspect-square h-4/5" src={CloseIcon} alt="close" />
        </button>

        <h1 className="mr-10 text-2xl">{title}</h1>

        {children}
      </div>
    </div>
  );
}
