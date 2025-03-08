"use client";
import { useRef, useState, useEffect } from "react";
import { gearSlotPlacement } from "@/models/Gear";
import Chart from "./chart";
import { type DOEReport } from "@/models/DungeonsOfEternityCache";

const colors = [
  "grey",

  "#ea001e",
  "#0176d3",

  ////////

  "#8a033e",
  "#b60554",
  "#ff538a",
  "#fe7298",
  "#fdb6c5",
  "#aacbff",
  "#78b0fd",
  "#57a3fd",
  "#1b96ff",
  "#0176d3",
  "#0b5cab",
  "#014486",
  "#032d60",

  "#ba0517",
  "#aa3001",
  "#ff5d2d",
  "#fe5c4c",
  "#ff906e",
  "#fe8f7d",
  /////////////////////////
  //// orange browns
  "#fe9339",
  "#e4a201",
  "#ca8501",
  "#a96404",
  "#8c4b02",
  "#5f3e02",
  "#4f2100",
  /////////////////////////
  /// greens
  "#194e31",
  "#396547",
  "#2e844a",
  "#3ba755",
  "#41b658",
  "#45c65a",
  "#91db8b",
  "#056764",
  "#0b827c",
  "#06a59a",

  ////////////////////////
  //// purple
  "#5a1ba9",
  "#7526e3",
  "#ad7bee",
  "#c29ef1",

  "#7f8ced",
  "#9ea9f1",

  "#7f8ced",
  "#8e9bef",
  "#9ea9f1",

  "#3a49da",
  "#2f2cb7",
  "#3a49da",
  "#5867e8",
  "#014486",
  "#0b5cab",
  "#0176d3",
  "#1b96ff",
  "#57a3fd",
  "#78b0fd",
  "#aacbff",
  "#05628a",
  "#107cad",
  "#0d9dda",
  "#08abed",
  "#1ab9ff",
  "#90d0fe",
];

export default function Renderer({ drops }) {
  const chartRef = useRef(null);
  const [tree, setTree] = useState({});

  useEffect(() => {
    const totalDrops = drops.length;
    let color = 0;

    const data = {
      name: "total drops",
      size: totalDrops,
      ratio: totalDrops / totalDrops,
      color: colors[color++],
      children: [],
    };

    const slots = Object.groupBy(
      drops,
      ({ Group }: { Group: string }) => gearSlotPlacement[Group],
    );

    for (const [slotName, ungrouped] of Object.entries(slots)) {
      //console.info("slotName", slotName);
      const slotPercent = Math.round((ungrouped.length / totalDrops) * 100);
      const slotChild = {
        name: `${slotName}: ${slotPercent}%`,
        size: ungrouped.length,
        ratio: ungrouped.length / totalDrops,
        color: colors[color++],
        children: [],
      };
      data.children.push(slotChild);

      const groups = Object.groupBy(ungrouped, ({ Group }) => Group);

      for (const [groupName, unnamed] of Object.entries(groups) as [
        string,
        DOEReport[],
      ][]) {
        //console.info("groupName", groupName);
        const groupPercent =
          Math.round((unnamed.length / totalDrops) * 10000) / 100;
        const groupChild = {
          name: `${groupName}: ${groupPercent}%`,
          size: unnamed.length,
          ratio: unnamed.length / totalDrops,
          color: colors[color++],
          children: [],
        };
        slotChild.children.push(groupChild);

        const names = Object.groupBy(
          unnamed,
          ({ Name }: { Name: string }) => Name,
        );
        for (const [name, unclassed] of Object.entries(names)) {
          // console.info("nameName", name);
          const namePercent =
            Math.round((unclassed.length / totalDrops) * 10000) / 100;
          const nameChild = {
            name: `${name}: ${namePercent}%`,
            size: unclassed.length,
            ratio: unclassed.length / totalDrops,
            color: colors[color++],
            children: unclassed,
          };
          groupChild.children.push(nameChild);
        }
      }
    }

    setTree(data);
  }, [drops]);

  return (
    <div>
      <div ref={chartRef}></div>
      <Chart chartref={chartRef} tree={tree} />
    </div>
  );
}
