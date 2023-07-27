export const elementIsSVGElement = (e: Element): e is SVGElement =>
  e.constructor.name.startsWith("SVG");
