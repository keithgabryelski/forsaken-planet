"use client";
import { useEffect } from "react";
import SunburstChart from "./sunburst";

export default function Sunburst({ chartref, tree }) {
  let height = undefined;
  let width = undefined;
  if (typeof window !== "undefined") {
    height = window.innerHeight * 0.8;
    width = window.innerWidth * 0.8;
  }
  useEffect(() => {
    const element = chartref.current;
    while (element.childElementCount > 0) {
      element.removeChild(element.children[0]);
    }
    SunburstChart()
      .data(tree)
      .label("name")
      .size("size")
      .excludeRoot(true)
      .height(height)
      .width(width)
      .color((d) => d.color)
      .tooltipContent((_d, node) => `Drops Seen: <i>${node.value}</i>`)
      .handleNonFittingLabel((label, availablePx) => {
        const numFitChars = Math.round(availablePx / 7); // ~7px per char
        return numFitChars < 5
          ? null
          : `${(label ?? "").slice(0, Math.round(numFitChars) - 3)}...`;
      })(chartref.current);
  }, [chartref, tree, height, width]);
  return null;
}
