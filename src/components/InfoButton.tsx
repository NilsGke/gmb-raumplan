import { ReactNode, useState } from "react";
import QuestionMark from "@assets/questionMark.svg";
import useKeyboard, { usePressedKeys } from "../hooks/useKeybaord";
import Popup from "./Popup";
import { twMerge } from "tailwind-merge";

export default function InfoButton() {
  const [popupOpen, setPopupOpen] = useState(false);
  const toggle = () => setPopupOpen((prev) => !prev);

  useKeyboard((key) => key === "?" && setPopupOpen(true));

  return (
    <>
      <button
        className="fixed bottom-[70px] right-4 z-20 flex h-12 w-12 items-center justify-center rounded-3xl bg-zinc-800"
        onClick={toggle}
        title="Info & About"
      >
        <img className="h-[70%] invert" src={QuestionMark} alt="info" />
      </button>

      <Popup
        open={popupOpen}
        close={() => setPopupOpen(false)}
        title="GMB - Raumplan"
      >
        <div className="my-6 flex flex-col gap-2">
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
              <a href="https://github.com/NilsGke/gmb-raumplan" target="_blank">
                github.com/NilsGke/gmb-raumplan
              </a>
            }
          />
        </div>

        <details open>
          <summary className="mb-2 cursor-pointer">Keyboard Shortcuts</summary>
          <div className="mb-2 flex flex-col gap-1 pl-4">
            <Row>
              Hilfe:
              <Key triggerKey="?">?</Key>
            </Row>
            <Row>
              Heranzoomen:
              <Key triggerKey="+">+</Key>
            </Row>
            <Row>
              Herauszoomen:
              <Key triggerKey="-">-</Key>
            </Row>
            <Row>
              Bewegen:
              <Key triggerKey="ArrowLeft">←</Key>
              <Key triggerKey="ArrowUp">↑</Key>
              <Key triggerKey="ArrowRight">→</Key>
              <Key triggerKey="ArrowDown">↓</Key>
            </Row>
            <Row>
              Suchen:
              <Key triggerKey="Control">strg</Key> +<Key triggerKey="f">f</Key>
            </Row>
          </div>
        </details>

        <p className="mt-6 text-sm text-zinc-400">- Nils Goeke</p>
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
  <div className="rounded-full bg-gray-200 px-2 py-0 transition hover:bg-gray-300">
    {children}
  </div>
);

const Row = ({ children }: { children: ReactNode }) => (
  <div className="felx justify-center gap-2">{children}</div>
);

const Key = ({
  children,
  triggerKey,
}: {
  children: ReactNode;
  triggerKey: KeyboardEvent["key"];
}) => {
  const pressedKeys = usePressedKeys();

  const mouseDownEvent = () =>
    document.dispatchEvent(new KeyboardEvent("keydown", { key: triggerKey }));
  const mouseUpEvent = () =>
    document.dispatchEvent(new KeyboardEvent("keyup", { key: triggerKey }));

  return (
    <button
      onMouseDown={mouseDownEvent}
      onMouseUp={mouseUpEvent}
      onMouseLeave={mouseUpEvent}
      className={twMerge(
        "ml-2 inline-block -translate-y-[2px] rounded-md border border-transparent bg-zinc-200 px-1 text-sm shadow-key",
        "active:translate-y-0  active:border-zinc-400 active:shadow-none",
        pressedKeys.some((pressedKey) => triggerKey === pressedKey) &&
          "translate-y-0 border-zinc-400 shadow-none",
      )}
    >
      {children}
    </button>
  );
};
