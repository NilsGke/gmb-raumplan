/**
 * extracts label from svg elements that have the following attribute: `inkscape:label="yourlabel"`
 */
export default function getInkscapeLabel(element: Element) {
  const str = element.outerHTML.split(">").at(0); // split at closing bracket to avoid reading labels from other elements
  if (str === undefined) return null;
  const regex = /inkscape:label="([a-zA-Z\s\-\d]*)"/;
  const match = regex.exec(str);
  if (match === null) return null;
  const label = match.at(1) || null;
  return label;
}
