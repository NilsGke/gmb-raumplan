import { ReactElement, useEffect, useRef, useState } from "react";
import Map from "@assets/map.svg";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Data, loadElements } from "./data";
import SearchBox from "./components/SearchBox";
import Spinner from "./components/Spinner";
import { twMerge } from "tailwind-merge";

function App() {
  const overlayElementRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Data | undefined>(undefined);

  const setup = async () => {
    if (containerRef.current === null)
      throw Error("container ref is null while trying to run setup");
    await mapSetup(containerRef).then((_data) => setData(_data));
  };

  const [loading, setLoading] = useState(true);

  const fetched = useRef(false);
  useEffect(() => {
    if (!fetched.current) {
      fetched.current = true;
      fetch("/map.svg")
        .then((res) => res.text())
        .then((svg) => {
          if (containerRef.current === null)
            throw Error("map container ref is null");
          containerRef.current.innerHTML = svg;

          setLoading(false);

          // add full height and width to new svg element
          document
            .querySelector("div > svg")
            ?.classList.add("w-full", "h-full");

      setup();
        });
    }
  }, []);

  return (
    <>
      <div className="absolute w-screen h-screen">
        <Spinner
          className={twMerge(
            "absolute h-20 w-20 bottom-[calc(50%-5rem/2)] left-[calc(50%-5rem/2)] transition-all duration-500",
            data !== undefined ? "opacity-0" : "opacity-100"
          )}
        />
        <TransformWrapper centerOnInit centerZoomedOut={false} smooth={false}>
          {({ zoomIn, zoomOut, resetTransform, zoomToElement }) => (
            <>
              {data === undefined ? (
                <Spinner className="fixed h-10 w-10 bottom-5 right-5" />
              ) : (
                <SearchBox
                  zoomToElement={(element: HTMLElement) =>
                    zoomToElement(element, 3, 500, "easeInQuad")
                  }
                  overlayRef={overlayElementRef}
                  data={data}
                />
              )}
              <div className="fixed bottom-3 left-3 z-10 flex flex-col gap-2">
                <ControlButton onClick={() => zoomIn()}>+</ControlButton>
                <ControlButton onClick={() => zoomOut()}>-</ControlButton>
                <ControlButton onClick={() => resetTransform()}>
                  0
                </ControlButton>
              </div>
              <TransformComponent
                wrapperClass="w-full h-full"
                contentClass="w-full h-full relative"
              >
                <div
                  className="absolute h-full w-full z-0 cursor-grab"
                  ref={overlayElementRef}
                />
                <object
                  data={Map}
                  type="image/svg+xml"
                  className="w-full h-full"
                  ref={objectElementRef}
                  onChange={setup}
                ></object>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </>
  );
}

function ControlButton({
  children,
  onClick,
}: {
  children: ReactElement | string;
  onClick: () => void;
}) {
  return (
    <button
      className="rounded-full cursor-pointer aspect-square bg-zinc-800 h-10"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default App;
