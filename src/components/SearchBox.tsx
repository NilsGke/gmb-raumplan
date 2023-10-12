import {
  CSSProperties,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import useKeyboard from "../hooks/useKeybaord";
import SearchIcon from "@assets/search.svg";
import CloseIcon from "@assets/close.svg";
import { Data, objectIsBuilding, objectisEntrySign } from "../data";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import containsAnySubstring from "../helpers/containsAnySubstring";
export default function SearchBox({
  data,
  zoomToElement,
  overlayRef,
  zoomIn,
  zoomOut,
  move,
}: {
  data: Data;
  zoomToElement: (element: HTMLElement) => void;
  overlayRef: RefObject<HTMLDivElement>;
  zoomIn: () => void;
  zoomOut: () => void;
  move: (direction: "left" | "up" | "right" | "down") => void;
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
        if (searchString !== "") setSearchString("");
        else setExpanded(false);
        break;

      case "+":
        zoomIn();
        break;
      case "-":
        zoomOut();
        break;
      case "ArrowRight":
        move("right");
        break;
      case "ArrowLeft":
        move("left");
        break;
      case "ArrowUp":
        move("up");
        break;
      case "ArrowDown":
        move("down");
        break;
      default:
        break;
    }
  });

  // focus input on expand
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (expanded && inputRef.current !== null) inputRef.current.select();
  }, [expanded]);

  const searchLower = searchString.toLowerCase().split(/-| |,|_/);

  const sortedRooms = useMemo(
    () =>
      data.rooms
        .map((room) => ({
          room,
          number: parseFloat(room.number?.content || "0"),
        }))
        .sort((a, b) => (a.number === undefined ? 2 : a.number - b.number))
        .map((room) => room.room),
    [data.rooms],
  );

  const sortedBuildings = useMemo(
    () =>
      data.buildings.sort((a, b) => ((a.name || "") > (b.name || "") ? 1 : -1)),
    [data.buildings],
  );

  const buildings =
    searchString.length === 0
      ? sortedBuildings
      : sortedBuildings.filter((building) => {
          if (building.name === null) return false;
          const buildingNameLower = building.name.toLowerCase();
          return searchLower.some(
            (str) =>
              buildingNameLower.includes(str) ||
              building.letter?.toLocaleLowerCase().includes(str),
          );
        });

  const rooms =
    searchString.length === 0
      ? sortedRooms
      : sortedRooms.filter((room) => {
          const roomStrings: string[] = [
            room.number?.content.toLowerCase(),
            ...(room.extraTexts?.map((t) => t.content.toLowerCase()) || []),
            room.building.letter?.toLowerCase(),
          ].filter((s) => s !== undefined) as string[];

          if (containsAnySubstring(searchLower, roomStrings)) return true;

          if (
            room.building.name !== null &&
            searchLower.includes(room.building.name?.toLowerCase())
          )
            return true;

          return false;
        });

  const entrySigns =
    searchString.length === 0
      ? data.entrySigns
      : data.entrySigns
          .filter(
            (entrySign) =>
              (entrySign.text !== null &&
                searchLower.includes(entrySign.text?.content.toLowerCase())) ||
              searchLower.includes("e"),
          )
          .sort((a, b) =>
            parseInt(a.text?.content.replace("E", "") || "0") <
            parseInt(b.text?.content.replace("E", "") || "0")
              ? -1
              : 1,
          );

  const allResults = [...buildings, ...rooms, ...entrySigns];

  const highlightElement = (element: SVGElement) => {
    if (overlayRef.current === null) return;
    setExpanded(false);
    const div = document.createElement("div");
    const border = 4;
    div.className = `absolute rounded border border-[${border}px] transition-all pointer-events-none`;

    const transformString =
      document.querySelector<HTMLDivElement>(".react-transform-component")
        ?.style.transform || "scale(1)";

    const scaleMatch = /scale\((\d+(\.\d+)?)\)/.exec(transformString);
    const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 0;

    const overlayPos = overlayRef.current.getBoundingClientRect();
    const elementPos = element.getBoundingClientRect();

    div.style.borderColor =
      element.style.fill === "rgb(238, 29, 35)" ? "#006ea1" : "red";
    div.style.left =
      (Math.abs(overlayPos.left) + elementPos.left) / scale - border + "px";
    div.style.top =
      (Math.abs(overlayPos.top) + elementPos.top) / scale - border + "px";
    div.style.width = elementPos.width / scale + border * 2 + "px";
    div.style.height = elementPos.height / scale + border * 2 + "px";
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
        },
      );
    });

    setTimeout(() => {
      div.remove();
    }, 4000);
  };

  return (
    <div
      title="Suchen"
      className={twMerge(
        "fixed bottom-[10px] right-4 z-20 overflow-hidden rounded-3xl bg-zinc-800 transition-all duration-300",
        expanded
          ? "bottom-0 right-0 h-full w-full rounded-none sm:bottom-4 sm:right-4 sm:h-[30rem] sm:max-h-[94%] sm:w-[22rem] sm:rounded-xl"
          : "h-12 w-12",
      )}
    >
      <header className="relative flex h-10 w-full justify-between ">
        <input
          type="search"
          className={twMerge(
            "m-4 h-10 rounded bg-zinc-700  text-white transition-all duration-300",
            expanded
              ? "m-3 mr-6 w-full p-2 opacity-100"
              : "m-0 w-0 p-0 opacity-0",
          )}
          ref={inputRef}
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            inputRef.current?.blur();
            const resultElement = allResults.at(0);
            if (resultElement === undefined) return;
            if (objectisEntrySign(resultElement)) {
              if (resultElement.rectElement !== null)
                highlightElement(resultElement.rectElement);
            } else if (objectIsBuilding(resultElement)) {
              const element =
                resultElement.outlineElement ||
                resultElement.buildingGroupElement;
              if (element) highlightElement(element);
            } else {
              const element =
                resultElement.roomFloorElement ||
                resultElement.building.outlineElement;
              if (element) highlightElement(element);
            }
          }}
          placeholder="Suchen..."
        />
        <button
          className={twMerge(
            " mr-0 mt-0 flex items-center justify-center transition-all duration-300",
            expanded ? "mr-4 mt-3 h-10 w-10" : "h-12 w-12",
          )}
          onClick={() => setExpanded((prev) => !prev)}
        >
          <img
            className={twMerge(
              "absolute aspect-square w-8 invert transition-all duration-300",
              expanded ? "opacity-0" : "opacity-100",
            )}
            src={SearchIcon}
            alt="search icon"
          />
          <img
            className={twMerge(
              "absolute aspect-square w-8 opacity-0 invert transition-all duration-300",
              expanded ? "opacity-100" : "",
            )}
            src={CloseIcon}
            alt="search icon"
          />
        </button>
      </header>

      <section className="scrollbar mt-4 h-[calc(100%-64px-10px)] w-full scroll-px-2 overflow-y-scroll p-2 ">
        <div>
          {buildings.length > 0 && (
            <ResultCategory name="Gebäude">
              {buildings.map((building, index) => (
                <ResultElement
                  key={building.name || index}
                  onClick={() => {
                    const element =
                      building.outlineElement || building.buildingGroupElement;

                    highlightElement(element);
                    zoomToElement(element as unknown as HTMLElement);
                  }}
                  style={{
                    backgroundColor:
                      building.rooms?.at(0)?.bgColor || undefined,
                    color: building.rooms?.at(0)?.textColor || undefined,
                  }}
                  title={`Eingang-${building.name || "Ohne-Bezeichnung"}`}
                >
                  {building.name || building.letter || "unnamed Building"}
                </ResultElement>
              ))}
            </ResultCategory>
          )}

          {rooms.length > 0 && (
            <ResultCategory name="Räume">
              {rooms.map((room, index) => {
                const extranames = room.extraTexts
                  ?.map((text) => text.content)
                  .join(", ");

                const name = extranames
                  ? extranames +
                    (room.number?.content ? ` (${room.number?.content})` : "")
                  : room.number?.content !== undefined
                  ? room.building.letter + "-" + room.number?.content
                  : room.extraTexts?.at(0)?.content || "unnamed Room";

                return (
                  <ResultElement
                    key={
                      (room.number?.content || "") +
                        (room.extraTexts?.at(0)?.content || "") || index
                    }
                    onClick={() => {
                      if (room.roomFloorElement)
                        highlightElement(room.roomFloorElement);
                      zoomToElement(
                        room.roomFloorElement as unknown as HTMLElement,
                      );
                    }}
                    style={{
                      backgroundColor: room.bgColor || undefined,
                      color: room.textColor || undefined,
                    }}
                    title={`Raum-${
                      room.number?.content ||
                      room.extraTexts?.find((t) => t.content !== "")?.content
                    }`}
                  >
                    {name}
                  </ResultElement>
                );
              })}
            </ResultCategory>
          )}

          {entrySigns.length > 0 && (
            <ResultCategory name="Eingänge">
              {entrySigns.map((entrySign, index) => (
                <ResultElement
                  key={entrySign.text?.content || index}
                  onClick={() => {
                    if (entrySign.rectElement)
                      highlightElement(entrySign.rectElement);
                    zoomToElement(
                      entrySign.rectElement as unknown as HTMLElement,
                    );
                  }}
                  style={{
                    backgroundColor: entrySign.bgColor || undefined,
                    color: entrySign.textColor || undefined,
                  }}
                  title={`Eingang-${
                    entrySign.text?.content || "Ohne-Bezeichnung"
                  }`}
                >
                  {entrySign.text?.content || "unnamed Entry"}
                </ResultElement>
              ))}
            </ResultCategory>
          )}

          {rooms.length === 0 && entrySigns.length === 0 && (
            <div className="text-zinc-500">Nichts gefunden :(</div>
          )}
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
  title,
}: {
  children: string | ReactNode | ReactNode[];
  onClick: () => void;
  className?: string;
  style?: CSSProperties;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      style={style}
      className={twMerge("m-1 h-10 rounded bg-green-200 p-2", className)}
      title={title}
    >
      {children}
    </button>
  );
}

function ResultCategory({
  children,
  name,
}: {
  children: ReactNode[];
  name: string;
}) {
  const [parent] = useAutoAnimate();
  return (
    <div>
      <details open>
        <summary className="cursor-pointer text-sm text-zinc-300">
          {name}
        </summary>
        <div ref={parent}>{...children}</div>
      </details>
    </div>
  );
}
