import { elementIsSVGElement } from "./typeguards";

export default function flattenHTMLCollectionTree(arr: HTMLCollection) {
  const elements: SVGElement[] = [];

  Array.from(arr).forEach((element) =>
    element.children.length !== 0
      ? elements.push(...flattenHTMLCollectionTree(element.children))
      : elementIsSVGElement(element)
      ? elements.push(element)
      : null,
  );

  return elements;
}
