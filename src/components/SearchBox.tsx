import { CSSProperties, ReactNode, RefObject, useState } from "react";
import { twMerge } from "tailwind-merge";
import useKeyboard from "../hooks/useKeybaord";
import SearchIcon from "@assets/search.svg";
import CloseIcon from "@assets/close.svg";
import { Data } from "../data";

export default function SearchBox({
  data,
  zoomToElement,
  overlayRef,
}: {
  data: Data;
  zoomToElement: (element: HTMLElement) => void;
  overlayRef: RefObject<HTMLDivElement>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [searchString, setSearchString] = useState("");

  useKeyboard((key, event) => {
    switch (key) {
      case "f":
        if (event.ctrlKey) {
          event.preventDefault();
          setExpanded(true);
        }
        break;
      case "Escape":
        setExpanded(false);
        break;
      default:
        break;
    }
  });

  const entries = [
    ...data.rooms
      .map((room) => ({
        room,
        number: parseFloat(room.number?.content || "0"),
      }))
      .sort((a, b) => a.number - b.number)
      .map((room) => room.room)
      .filter((room) =>
        room.number?.content.toLowerCase().includes(searchString.toLowerCase())
      ),
  ];

  const highlightElement = (element: SVGElement) => {
    if (overlayRef.current === null) return;
    setExpanded(false);
    const div = document.createElement("div");
    const border = 4;
    div.className = `absolute rounded border border-[${border}px] transition-all`;
    const rect = element.getBoundingClientRect();
    console.log(element.style.fill);
    div.style.borderColor =
      element.style.fill === "rgb(238, 29, 35)" ? "#006ea1" : "red";
    div.style.left = rect.x - border + "px";
    div.style.top = rect.y - border + "px";
    div.style.width = rect.width + border * 2 + "px";
    div.style.height = rect.height + border * 2 + "px";
    overlayRef.current.appendChild(div);
    requestAnimationFrame(() => {
      zoomToElement(div);
      div.animate(
        [
          {
            scale: "1",
          },
          { scale: "1.2" },
        ],
        {
          duration: 500,
          easing: "ease-in-out",
          direction: "alternate",
          iterations: 10,
        }
      );
    });

    setTimeout(() => {
      div.remove();
    }, 3000);
  };

  return (
    <div
      className={twMerge(
        "z-20 fixed bottom-4 right-4 rounded-3xl transition-all bg-zinc-800 duration-300 overflow-hidden",
        expanded
          ? "w-full h-full sm:w-[22rem] sm:h-[30rem] rounded-none sm:rounded-xl bottom-0 right-0 sm:bottom-4 sm:right-4"
          : "w-12 h-12"
      )}
    >
      <header className="w-full h-10 flex justify-between relative ">
        <input
          type="text"
          className={twMerge(
            "rounded bg-zinc-700 m-4 h-10  text-white transition-all duration-300",
            expanded
              ? "w-full m-3 mr-6 p-2 opacity-100"
              : "w-0 m-0 p-0 opacity-0"
          )}
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder="Suchen..."
        />
        <button
          className={twMerge(
            " flex justify-center items-center transition-all mt-0 mr-0 duration-300",
            expanded ? "mt-3 mr-4 h-10 w-10" : "h-12 w-12"
          )}
          onClick={() => setExpanded((prev) => !prev)}
        >
          <img
            className={twMerge(
              "absolute invert aspect-square w-8 transition-all duration-300",
              expanded ? "opacity-0" : "opacity-100"
            )}
            src={SearchIcon}
            alt="search icon"
          />
          <img
            className={twMerge(
              "absolute invert aspect-square transition-all w-8 opacity-0 duration-300",
              expanded ? "opacity-100" : ""
            )}
            src={CloseIcon}
            alt="search icon"
          />
        </button>
      </header>

      <section className="mt-4 p-2 w-full h-[calc(100%-64px-10px)] overflow-y-scroll scroll-px-2 scrollbar ">
        <div>
          {entries.map((room) => (
            <ResultElement
              onClick={() => {
                console.log(room.roomFloorElement);
                if (room.roomFloorElement)
                  highlightElement(room.roomFloorElement);
                zoomToElement(room.roomFloorElement as unknown as HTMLElement);
              }}
              style={{
                backgroundColor: room.bgColor || undefined,
                color: room.textColor || undefined,
              }}
            >
              {room.number?.content ||
                room.extraTexts?.at(0)?.content ||
                "unnamed Room"}
            </ResultElement>
          ))}
        </div>
      </section>
    </div>
  );
}

function ResultElement({
  children,
  onClick,
  className = "",
  style,
}: {
  children: string | ReactNode | ReactNode[];
  onClick: () => void;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={style}
      className={twMerge("h-10 rounded bg-green-200 m-1 p-2", className)}
    >
      {children}
    </button>
  );
}
