import { useRef } from "react";
import Map from "@assets/map.svg";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import data, { loadElements } from "./data";

function App() {
  const overlayElementRef = useRef<HTMLDivElement>(null);
  const objectElementRef = useRef<HTMLObjectElement>(null);

  const setup = async () => {
    console.log("setup");

    loadElements(objectElementRef).then(() => console.log("loaded", data));
  };
  return (
    <>
      <div className="absolute w-screen h-screen">
        <TransformWrapper centerOnInit centerZoomedOut={false}>
          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <>
              <div className="absolute bottom-0 left-0">
                <button onClick={() => zoomIn()}>+</button>
                <button onClick={() => zoomOut()}>-</button>
                <button onClick={() => resetTransform()}>x</button>
              </div>
              <TransformComponent
                wrapperClass="w-full h-full"
                contentClass="w-full h-full relative"
              >
                <div
                  className="absolute h-full w-full"
                  ref={overlayElementRef}
                />
                <object
                  data={Map}
                  type="image/svg+xml"
                  className="w-full h-full"
                  ref={objectElementRef}
                  onLoad={setup}
                ></object>
                {/* <img src={Map} alt="" className="h-full " /> */}
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
    </>
  );
}

export default App;
