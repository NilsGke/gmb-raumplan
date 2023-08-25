import { ReactNode, useState } from "react";
import QuestionMark from "@assets/questionMark.svg";
import useKeyboard from "../hooks/useKeybaord";
import Popup from "./Popup";

export default function InfoButton() {
  const [popupOpen, setPopupOpen] = useState(false);
  const toggle = () => setPopupOpen((prev) => !prev);

  useKeyboard((key) => key === "?" && setPopupOpen(true));

  return (
    <>
      <button
        className="z-20 h-12 w-12 fixed flex justify-center items-center bottom-[70px] right-4 rounded-3xl bg-zinc-800"
        onClick={toggle}
      >
        <img className="invert h-[70%]" src={QuestionMark} alt="info" />
      </button>

      <Popup
        open={popupOpen}
        close={() => setPopupOpen(false)}
        title="GMB - Raumplan"
      >
        <div className="flex flex-col gap-2 my-6">
          <h2 className="text-lg">Feedback & Bugs: </h2>
          <Item
            text="Email:"
            chip={
              <a href="mailto:ekeogs@gmail.com" target="_blank">
                ekeogs@gmail.com
              </a>
            }
          />
          <Item
            text="Github:"
            chip={
              <a href="https://github.com/NilsGke/floor-map" target="_blank">
                github.com/NilsGke/floor-map
              </a>
            }
          />
        </div>

        <details open>
          <summary className="cursor-pointer mb-2">Keyboard Shortcuts</summary>
          <div className="flex flex-col gap-1 pl-4 mb-2">
            <Row>
              Hilfe:
              <Key>?</Key>
            </Row>
            <Row>
              Heranzoomen:
              <Key>+</Key>
            </Row>
            <Row>
              Herauszoomen:
              <Key>-</Key>
            </Row>
            <Row>
              Bewegen:
              <Key>Pfeiltasten</Key>
            </Row>
            <Row>
              Suchen:
              <Key>strg</Key> +<Key>f</Key>
            </Row>
          </div>
        </details>

        <p className="text-zinc-400 mt-6 text-sm">- Nils Goeke</p>
      </Popup>
    </>
  );
}

const Item = ({ text, chip }: { text?: ReactNode; chip: ReactNode }) => (
  <div className="flex items-center gap-2">
    {text} <Chip>{chip}</Chip>
  </div>
);

const Chip = ({ children }: { children?: ReactNode }) => (
  <div className="bg-gray-200 rounded-full px-2 py-0">{children}</div>
);

const Row = ({ children }: { children: ReactNode }) => (
  <div className="felx justify-center gap-2">{children}</div>
);

const Key = ({ children: key }: { children: string }) => (
  <button
    onClick={() =>
      document.dispatchEvent(new KeyboardEvent("keydown", { key }))
    }
    className="rounded-md text-sm bg-zinc-200 px-1 border border-transparent shadow-key -translate-y-[2px] w-min inline-block ml-2 active:translate-y-0  active:border-zinc-400 active:shadow-none"
  >
    {key}
  </button>
);
