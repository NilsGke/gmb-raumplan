/**
 * extracts `building-name` attribute from svg elements
 */
export function getBuildingName(element: Element) {
  return extractLabelFromElement(element, "building-name");
}

/**
 * extracts `building-letter` attribute from svg elements
 */
export function getBuildingLetter(element: Element) {
  return extractLabelFromElement(element, "building-letter");
}

function extractLabelFromElement(element: Element, attributeName: string) {
  const str = element.outerHTML.split(">").at(0); // split at closing bracket to avoid reading labels from other elements
  if (str === undefined) return null;
  const regex = new RegExp(`${attributeName}="([a-zA-Z\\s\\-\\d]*)"`);
  const match = regex.exec(str);
  if (match === null) return null;
  const text = match.at(1) || null;
  return text;
}
