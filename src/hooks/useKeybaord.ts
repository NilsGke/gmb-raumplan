import { useEffect, useState } from "react";

const useKeyboard = (
  callback: (key: KeyboardEvent["key"], e: KeyboardEvent) => void,
) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => callback(e.key, e);
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [callback]);
};

export default useKeyboard;

export const usePressedKeys = () => {
  const [pressedKeys, setPressedKeys] = useState<KeyboardEvent["key"][]>([]);
  useEffect(() => {
    const keydownHandler = (e: KeyboardEvent) =>
      setPressedKeys((prev) => [...prev, e.key]);

    const keyupHandler = (e: KeyboardEvent) =>
      setPressedKeys((prev) => prev.filter((key) => key !== e.key));

    document.addEventListener("keydown", keydownHandler);
    document.addEventListener("keyup", keyupHandler);

    return () => {
      document.removeEventListener("keydown", keydownHandler);
      document.removeEventListener("keyup", keyupHandler);
    };
  }, []);

  return pressedKeys;
};
