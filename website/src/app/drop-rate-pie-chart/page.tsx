import { Chart } from "chart.js";
import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import { gearSlotPlacement } from "@/models/Gear";
import Renderer from "./renderer.tsx";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Drop Rate Pie Chart",
  description:
    "Forsaken Planet: Dungeons Of Eternity gear drop-rate pie chart.",
};

function gearSorter([e1g, e1s], [e2g, e2s]) {
  if (e1s < e2s) {
    return -1;
  }
  if (e1s > e2s) {
    return 1;
  }
  if (e1g < e2g) {
    return -1;
  }
  if (e1g > e2g) {
    return 1;
  }
  return 0;
}

function collateSlotData(cache): {
  slotData: Chart.DoughnutChartOptions;
  gearByBackThenHip: string[];
} {
  const gearSlotLabels = [
    ...[...Object.values(gearSlotPlacement)]
      .reduce((a, e) => a.add(e), new Set())
      .values(),
  ].sort();
  const gearSlotValues = gearSlotLabels.map(
    (slotName) =>
      cache.statistics.slots[slotName] / cache.statistics.totalDrops,
  );
  const entries = Object.entries(gearSlotPlacement).sort(gearSorter);
  const gearByBackThenHip = entries.map((e) => e[0]);

  const slotData = {
    labels: gearSlotLabels,
    datasets: [
      {
        data: gearSlotValues,
        backgroundColor: ["#ea001e", "#0176d3"],
        hoverBackgroundColor: [],
      },
    ],
  };
  return {
    slotData,
    gearByBackThenHip,
  };
}

function collateData2(
  cache,
  gearByBackThenHip,
): { groupData: Chart.DoughnutChartOptions } {
  const gearData2 = gearByBackThenHip.map((g) => {
    return cache.statistics.byGroup?.get(g);
  });
  const data2 = {
    labels: gearByBackThenHip,
    datasets: [
      {
        data: gearData2,
        backgroundColor: [
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
        ],
        hoverBackgroundColor: [],
      },
    ],
  };
  return { groupData: data2 };
}

function collateData3(
  cache,
  gearByBackThenHip,
): { gearData: Chart.DoughnutChartOptions } {
  const gear3DataLabels = gearByBackThenHip
    .map((groupName) => {
      const gearDrops = cache.indexes.byGroup.get(groupName) ?? [];
      const names = [...new Set(gearDrops.map((g) => g.Name))].sort();
      return names;
    })
    .flat();
  const data3: Chart.DoughnutChartOptions = {
    labels: gear3DataLabels,
    datasets: [
      {
        data: gear3DataLabels.map((l) => cache.statistics.byName.get(l)),
        backgroundColor: [
          "#aa3001",
          "#ff5d2d",
          "#ff906e",
          "#ba0517",
          "#fe5c4c",
          "#fe8f7d",
          "#ca8501",
          "#4f2100",
          "#5f3e02",
          "#a96404",
          "#fe9339",
          "#8c4b02",
          "#e4a201",
          "#f9e3b6",
          "#3a49da",
          "#7f8ced",
          "#9ea9f1",
          "#5a1ba9",
          "#7526e3",
          "#ad7bee",
          "#c29ef1",

          "#2f2cb7",
          "#3a49da",
          "#5867e8",
          "#7f8ced",
          "#8e9bef",
          "#9ea9f1",
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
          "#03b4a7",
          "#01c3b3",
          "#04e1cb",
        ],
        hoverBackgroundColor: [],
      },
    ],
  };
  return { gearData: data3 };
}

export default async function DropRatePieChart() {
  const cache = await DungeonsOfEternityCache.Factory();
  const options: Chart.DoughnutChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        formatter: null,
        color: "white",
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const slotOptions: Chart.DoughnutChartOptions = Object.assign(
    { cutout: "40%" },
    options,
  );
  const groupOptions: Chart.DoughnutChartOptions = Object.assign(
    { cutout: "50%" },
    options,
  );
  const gearOptions: Chart.DoughnutChartOptions = Object.assign(
    { cutout: "50%" },
    options,
  );

  const { slotData, gearByBackThenHip } = collateSlotData(cache);
  const { groupData } = collateData2(cache, gearByBackThenHip);
  const { gearData } = collateData3(cache, gearByBackThenHip);

  return (
    <Renderer
      slotData={slotData}
      slotOptions={slotOptions}
      groupData={groupData}
      groupOptions={groupOptions}
      gearData={gearData}
      gearOptions={gearOptions}
    />
  );
}
