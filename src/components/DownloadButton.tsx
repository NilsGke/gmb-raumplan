import DownloadIcon from "@/assets/download.svg";
import { ReactNode, useEffect, useRef, useState } from "react";
import Popup from "./Popup";
// downloadFiles
import RaumplanJPG from "@/assets/files/GMB-Raumplan.jpg";
import RaumplanPDF from "@/assets/files/GMB-Raumplan.pdf";
import RaumplanPNG from "@/assets/files/GMB-Raumplan.png";
import RaumplanSVG from "@/assets/files/GMB-Raumplan.svg";
import readableFileSize from "../helpers/readableFileSize";
import Spinner from "./Spinner";

export default function DownloadButton() {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setPopupOpen(true)}
        title="download Raumplen"
        className="z-20 h-12 w-12 fixed flex justify-center items-center bottom-[130px] right-4 rounded-3xl bg-zinc-800"
      >
        <img className="invert w-[60%]" src={DownloadIcon} alt="download" />
      </button>

      <Popup
        open={popupOpen}
        close={() => setPopupOpen(false)}
        title="Format Wählen"
      >
        <div className="flex">
          <Button url={RaumplanJPG} prefetch={popupOpen} mime="image/jpg">
            JPG
          </Button>
          <Button url={RaumplanPNG} prefetch={popupOpen} mime="image/png">
            PNG
          </Button>
          <Button url={RaumplanPDF} prefetch={popupOpen} mime="application/pdf">
            PDF
          </Button>
          <Button url={RaumplanSVG} prefetch={popupOpen} mime="image/svg">
            SVG
          </Button>
        </div>
      </Popup>
    </>
  );
}

const Button = ({
  url,
  children,
  mime,
  prefetch,
}: {
  url: string;
  children: ReactNode;
  mime: string;
  prefetch: boolean;
}) => {
  const [rawSize, setRawSize] = useState<number | undefined>(undefined);
  const readableSize = readableFileSize(rawSize || 0, true, 0);

  const data = useRef<Blob | null>(null);
  const idleRequest = useRef<number | null>(null);

  useEffect(() => {
    if (idleRequest.current !== null || rawSize !== undefined) return;

    idleRequest.current = requestIdleCallback(
      () =>
        fetch(url).then(async (res) => {
          setRawSize(Number(res.headers.get("content-length"))); // initial size to display
          const file = await res.blob();
          setRawSize(file.size); // fallback if content-length provided
          data.current = file;
        }),
      {
        timeout: 100,
      }
    );
  }, [url, prefetch, rawSize]);

  const download = () => {
    if (data.current === null)
      return alert(`file not avalible, please download from: ${url}`);

    const match = mime.match(/\/(\w+)(?:\?|$)/);
    if (match === null)
      return alert("could not extract fileExtension from mimetype");
    const extension = match[1];

    const downloadURL = window.URL.createObjectURL(
      new Blob([data.current], {
        type: mime,
      })
    );

    const element = document.createElement("a");
    element.setAttribute("href", downloadURL);
    element.setAttribute("download", `GMB-Raumplan.${extension}`);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  return (
    <button
      className="m-4 p-2 rounded-xl bg-zinc-100 border border-zinc-400 flex flex-col justify-center items-center h-16 w-20"
      onClick={download}
    >
      {children} <br />
      {rawSize ? readableSize : <Spinner className="h-5 w-5 opacity-60" />}
    </button>
  );
};
