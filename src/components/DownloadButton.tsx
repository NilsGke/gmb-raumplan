import DownloadIcon from "@/assets/download.svg";
import { ReactNode, useRef, useState } from "react";
import Popup from "./Popup";
import OpenInNewIcon from "@/assets/openInNew.svg";
// downloadFiles
// JPG
import RaumplanJPG_x100 from "@/assets/files/GMB-Raumplan_Layer__x100.jpg";
import RaumplanJPG_x250 from "@/assets/files/GMB-Raumplan_Layer__x250.jpg";
import RaumplanJPG_x500 from "@/assets/files/GMB-Raumplan_Layer__x500.jpg";
import RaumplanJPG_x750 from "@/assets/files/GMB-Raumplan_Layer__x750.jpg";
import RaumplanJPG_x1000 from "@/assets/files/GMB-Raumplan_Layer__x1000.jpg";
// PNG
import RaumplanPNG_x100 from "@/assets/files/GMB-Raumplan_Layer__x100.png";
import RaumplanPNG_x250 from "@/assets/files/GMB-Raumplan_Layer__x250.png";
import RaumplanPNG_x500 from "@/assets/files/GMB-Raumplan_Layer__x500.png";
import RaumplanPNG_x750 from "@/assets/files/GMB-Raumplan_Layer__x750.png";
import RaumplanPNG_x1000 from "@/assets/files/GMB-Raumplan_Layer__x1000.png";
// Other
import RaumplanSVG from "@/assets/files/GMB-Raumplan_Layer.svg";
import RaumplanPDF from "@/assets/files/GMB-Raumplan_Layer.pdf";
import { twMerge } from "tailwind-merge";
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
        <div className="flex gap-4">
          <Col title="JPG">
            <Button url={RaumplanJPG_x100} mime="image/jpg">
              x100
            </Button>
            <Button url={RaumplanJPG_x250} mime="image/jpg">
              x250
            </Button>
            <Button url={RaumplanJPG_x500} mime="image/jpg" highlighted>
              x500
            </Button>
            <Button url={RaumplanJPG_x750} mime="image/jpg">
              x750
            </Button>
            <Button url={RaumplanJPG_x1000} mime="image/jpg">
              x1000
            </Button>
          </Col>

          <Col title={"PNG"}>
            <Button url={RaumplanPNG_x100} mime="image/png">
              x100
            </Button>
            <Button url={RaumplanPNG_x250} mime="image/png">
              x250
            </Button>
            <Button url={RaumplanPNG_x500} mime="image/png" highlighted>
              x500
            </Button>
            <Button url={RaumplanPNG_x750} mime="image/png">
              x750
            </Button>
            <Button url={RaumplanPNG_x1000} mime="image/png">
              x1000
            </Button>
          </Col>

          <Col title="Andere">
            <Button url={RaumplanSVG} mime="image/svg+xml" highlighted>
              SVG
            </Button>
            <Button url={RaumplanPDF} mime="application/pdf" highlighted>
              PDF
            </Button>
          </Col>
        </div>
      </Popup>
    </>
  );
}

const Col = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="flex flex-col items-center">
    <h2>{title}</h2>
    <div>{children}</div>
  </div>
);

const Button = ({
  url,
  children,
  mime,
  highlighted,
}: {
  url: string;
  children: ReactNode;
  mime: string;
  highlighted?: boolean;
}) => {
  const [downloading, setDownloading] = useState(false);

  const downloaded = useRef<{
    file: Blob;
    extension: string;
  } | null>(null);

  const download = async () => {
    setDownloading(true);
    const res = await fetch(url);
    const file = await res.blob();

    const match = mime.match(/\/(\w+)(?:\+|$)/);
    if (match === null) {
      alert("could not extract fileExtension from mimetype");
      setDownloading(false);
      throw Error("could not extract fileExtension from mimetype");
    }
    const extension = match[1];

    const blobFile = new Blob([file], {
      type: mime,
    });

    downloaded.current = {
      extension,
      file: blobFile,
    };

    setDownloading(false);

    return { file, extension };
  };

  const downloadToUsersMachine = ({
    extension,
    file,
  }: Awaited<ReturnType<typeof download>>) => {
    const downloadUrl = URL.createObjectURL(file);
    const element = document.createElement("a");
    element.setAttribute("href", downloadUrl);
    element.setAttribute("download", `GMB-Raumplan.${extension}`);

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  const openInNewTab = ({ file }: Awaited<ReturnType<typeof download>>) => {
    const downloadUrl = URL.createObjectURL(file);
    const element = document.createElement("a");
    element.setAttribute("href", downloadUrl);
    element.setAttribute("target", "_blank");

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  return (
    <div className="flex justify-center items-center">
      <button
        className={twMerge(
          "group relative m-1 px-3 py-1  whitespace-nowrap rounded-xl bg-zinc-100 border border-zinc-400 flex flex-col justify-center items-center hover:bg-zinc-200",
          highlighted
            ? " outline outline-1  outline-blue-600 border-blue-600"
            : ""
        )}
        onClick={() => {
          if (downloaded.current === null)
            download().then(downloadToUsersMachine);
          else downloadToUsersMachine(downloaded.current);
        }}
        title={highlighted ? "Empfohlene Auflösung" : undefined}
      >
        {children}
      </button>

      <button
        onClick={() => {
          if (downloaded.current === null) download().then(openInNewTab);
          else openInNewTab(downloaded.current);
        }}
        className="group-hover:bg-zinc-100 !hover:bg-zinc-300 "
        title="in neuem Tab öffnen"
      >
        {downloading ? (
          <Spinner className="h-3 w-3" />
        ) : (
          <img src={OpenInNewIcon} alt="open in new tab" />
        )}
      </button>
    </div>
  );
};
