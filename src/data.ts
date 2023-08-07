import flattenHTMLCollectionTree from "./helpers/flatenHTMLCollectionTree";
import getInkscapeLabel from "./helpers/getInkscapeLabel";

const roomNumberRegex = /^([0-9]{3})(\.[0-9])?$/; // https://regexr.com/7hr5f

export type Building = {
  name: string | null;
  buildingGroupElement: SVGGElement;
  outlineElement: SVGRectElement | SVGPathElement | null;
  rooms: Room[] | null;
};

export type Room = {
  number: Text | null;
  extraTexts: Text[] | null;
  roomFloorElement: SVGRectElement | SVGPathElement | null;
  building: Building;
  bgColor: string | null;
  textColor: string | null;
};

export type EntrySign = {
  textElement: SVGTSpanElement;
  rectElement: SVGRect;
};

type Text = {
  element: SVGTextElement;
  content: string;
};

export type Data = {
  buildings: Building[];
  rooms: Room[];
  entrySigns: EntrySign[];
  document: Document | null;
};

export async function mapSetup(containerRef: React.RefObject<HTMLElement>) {
  const data: Data = {
    buildings: [],
    rooms: [],
    entrySigns: [],
    document: null,
  };

  const container = containerRef.current;
  if (container === null) throw Error("container is null");

  const svg = Array.from(container.children).at(0);
  if (svg === undefined) throw Error("svg is undefined");

  // load rooms
  const elements = flattenHTMLCollectionTree(svg.children);
  // remove images
  elements.forEach((elm) =>
    elm.constructor.name === "SVGImageElement" ? elm.remove() : null
  );

  data.buildings = Array.from(
    svg.querySelectorAll<SVGGElement>(".building")
  ).map((buildingGroupElement) => {
    const building: Building = {
      buildingGroupElement: buildingGroupElement,
      name: null,
      outlineElement: null,
      rooms: null,
    };

    building.name = getInkscapeLabel(buildingGroupElement);
    if (building.name === null)
      console.error(
        'Could not extract name from building! Please add inkscape:label="yourBuildingName" to element.',
        buildingGroupElement
      );

    building.outlineElement = buildingGroupElement.querySelector<
      SVGRectElement | SVGPathElement
    >(".buildingOutline");

    if (building.outlineElement === null) {
      console.error(
        `Could not find outline for building: "${building.name}"`,
        buildingGroupElement
      );
    }

    const roomContainerElement =
      buildingGroupElement.querySelector<SVGGElement>(".roomContainer");
    if (roomContainerElement === null)
      console.error(
        `Could not find room container for building: "${building.name}"`,
        buildingGroupElement
      );

    if (roomContainerElement === null) building.rooms = [];
    else
      building.rooms = (
        Array.from(roomContainerElement.children).filter(
          (elm) => elm.constructor.name === "SVGGElement"
        ) as SVGGElement[]
      ).map((roomGroup) => {
        const textElements = roomGroup.querySelectorAll<SVGTextElement>("text");
        if (textElements.length === 0)
          console.error(
            "could not find a text element inside room group",
            roomGroup
          );

        const numberElement = Array.from(textElements).find((element) =>
          roomNumberRegex.test(element.textContent || "")
        );
        if (numberElement === undefined)
          console.error(
            "could not find text element that satisfies room number regex",
            roomGroup
          );

        const extraTexts: Room["extraTexts"] = Array.from(textElements)
          .filter(
            (element) => element.textContent !== numberElement?.textContent
          )
          .map((element) => ({
            element,
            content: element.textContent || "",
          }));

        const number: Room["number"] = numberElement
          ? {
              element: numberElement,
              content: numberElement?.textContent || "",
            }
          : null;

        const roomFloorElement = roomGroup.querySelector<
          SVGRectElement | SVGPathElement
        >("rect, path");
        if (roomFloorElement === null)
          console.error(`could not find room floor element`, roomGroup);

        const bgColor = roomFloorElement?.style.fill || null;
        const textColor = number?.element.style.fill || null;

        return {
          number,
          extraTexts,
          building,
          roomFloorElement,
          bgColor,
          textColor,
        };
      });
    return building;
  });

  data.rooms = data.buildings.map((building) => building.rooms || []).flat();

  console.log(data);
  // data.rooms.forEach((room) => (room.roomElement.style.opacity = "0.2"));
  // console.log({ roomNumbers, entrySigns, stairSigns });
  return data;
}
