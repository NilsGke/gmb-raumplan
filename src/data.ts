import flattenHTMLCollectionTree from "./helpers/flatenHTMLCollectionTree";
import getInkscapeLabel from "./helpers/getInkscapeLabel";

export type Building = {
  name: string | null;
  buildingGroupElement: SVGGElement;
  outlineElement: SVGRectElement | SVGPathElement | null;
  rooms: Room[] | null;
};

export type Room = {
  number: string | null;
  textElement: SVGTSpanElement | null;
  roomFloorElement: SVGRectElement | SVGPathElement | null;
  building: Building;
};

export type EntrySign = {
  textElement: SVGTSpanElement;
  rectElement: SVGRect;
};

const data: {
  buildings: Building[];
  rooms: Room[];
  entrySigns: EntrySign[];
  document: Document | null;
} = {
  buildings: [],
  rooms: [],
  entrySigns: [],
  document: null,
};
export default data;
export let loaded = false;

export async function loadElements(
  svgObjectRef: React.RefObject<HTMLObjectElement>
) {
  const svgObject = svgObjectRef.current;
  if (svgObject === null) throw Error("floor-plan is null");

  if (svgObject.contentWindow === null)
    throw Error("htmlObjectElement has no content window");

  data.document = svgObject.contentWindow.document;
  const svg = Array.from(svgObject.contentWindow.document.children).at(0);
  if (svg === undefined) throw Error("svg is undefined");
  console.log(svg);

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
        const textElement = roomGroup.querySelector<SVGTextElement>("text");
        if (textElement === null)
          console.error("could not find room number text element", roomGroup);

        const number = textElement?.textContent || null;

        const roomFloorElement = roomGroup.querySelector<
          SVGRectElement | SVGPathElement
        >("rect, path");
        if (roomFloorElement === null)
          console.error(`could not find room floor element`, roomGroup);

        return {
          number,
          building,
          roomFloorElement,
          textElement,
        };
      });

    return building;
  });

  // get all room-floor elements

  loaded = true;

  console.log(data);
  // data.rooms.forEach((room) => (room.roomElement.style.opacity = "0.2"));
  // console.log({ roomNumbers, entrySigns, stairSigns });
  return;
}
