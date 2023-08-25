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
        "w-full h-full fixed top-0 left-0 backdrop-blur-sm backdrop-brightness-50 flex justify-center items-center opacity-0 pointer-events-none transition-opacity",
        open && " opacity-100 z-50 pointer-events-auto"
      )}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="p-5 bg-white rounded-3xl relative max-w-[90%]">
        <button
          className="absolute top-5 right-5 h-7 w-7 aspect-square flex justify-center items-center"
          onClick={() => close()}
          title="schließen"
        >
          <img className="h-4/5 aspect-square" src={CloseIcon} alt="close" />
        </button>

        <h1 className="text-2xl mr-10">{title}</h1>

        {children}
      </div>
    </div>
  );
}
