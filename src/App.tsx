import { ReactElement, useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Data, mapSetup } from "./data";
import SearchBox from "./components/SearchBox";
import Spinner from "./components/Spinner";
import zoomInIcon from "@assets/zoomIn.svg";
import zoomOutIcon from "@assets/zoomOut.svg";
import fullZoomOutIcon from "@assets/fullZoomOut.svg";
import Map from "@assets/map/GMB-Raumplan.svg";
import InfoButton from "./components/InfoButton";
import DownloadButton from "./components/DownloadButton";

function App() {
  console.log(Map);
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
      fetch(Map)
        .then((res) => res.text())
        .then((svg) => {
          if (containerRef.current === null)
            throw Error("map container ref is null");
          containerRef.current.innerHTML = svg;

          // add full height and width to new svg element
          document
            .querySelector("div > svg")
            ?.classList.add("w-full", "h-full");

          setLoading(false);

          setup();
        });
    }
  }, []);

  return (
    <>
      <div className="absolute h-screen w-screen">
        {loading && (
          <Spinner className="absolute bottom-[calc(50%-5rem/2)] left-[calc(50%-5rem/2)] h-20 w-20 transition-all duration-500" />
        )}
        <InfoButton />
        <DownloadButton />
        <TransformWrapper
          centerOnInit
          centerZoomedOut
          smooth={false}
          limitToBounds
        >
          {({
            zoomIn,
            zoomOut,
            resetTransform,
            zoomToElement,
            setTransform,
            instance,
          }) => (
            <>
              {data === undefined ? (
                <Spinner className="fixed bottom-5 right-5 h-10 w-10" />
              ) : (
                <SearchBox
                  zoomToElement={(element: HTMLElement) =>
                    zoomToElement(
                      element,
                      window.innerWidth < 800 ? 3 : 2,
                      500,
                      "easeOut",
                    )
                  }
                  zoomIn={() => zoomIn()}
                  zoomOut={() => zoomOut()}
                  move={(direction) => {
                    let x = 0,
                      y = 0;
                    const d = 80;
                    switch (direction) {
                      case "right":
                        x = -d;
                        break;
                      case "left":
                        x = d;
                        break;
                      case "up":
                        y = d;
                        break;
                      case "down":
                        y = -d;
                        break;
                      default:
                        break;
                    }
                    const current = instance.transformState;
                    setTransform(
                      current.positionX + x,
                      current.positionY + y,
                      current.scale,
                      100,
                      "easeOutCubic",
                    );
                  }}
                  overlayRef={overlayElementRef}
                  data={data}
                />
              )}
              <div className="fixed bottom-3 left-3 z-10 flex flex-col gap-2">
                <ControlButton title="vergrößern" onClick={() => zoomIn()}>
                  <img
                    className="h-2/3 invert"
                    src={zoomInIcon}
                    alt="zoom in"
                  />
                </ControlButton>
                <ControlButton title="verkleinern" onClick={() => zoomOut()}>
                  <img
                    className="h-2/3 invert"
                    src={zoomOutIcon}
                    alt="zoom out"
                  />
                </ControlButton>
                <ControlButton
                  title="zurücksetzten"
                  onClick={() => resetTransform()}
                >
                  <img
                    className="h-2/3 invert"
                    src={fullZoomOutIcon}
                    alt="full zoom out"
                  />
                </ControlButton>
              </div>

              <TransformComponent
                wrapperClass="!w-full !h-full"
                contentClass="!w-full !h-full relative"
              >
                <div
                  className="flex h-full w-full items-center justify-center"
                  ref={containerRef}
                />
                <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
                  <div
                    className="relative h-full w-full"
                    ref={overlayElementRef}
                  />
                </div>
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
  title,
}: {
  children: ReactElement | string;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      className="flex aspect-square h-10 cursor-pointer items-center justify-center rounded-full bg-zinc-800 text-white"
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}

export default App;
