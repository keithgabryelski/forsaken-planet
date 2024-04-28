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
        backgroundColor: ["#903", "#33c"],
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
    return cache.statistics.byGroup?.get(g) * 100;
  });
  const data2 = {
    labels: gearByBackThenHip,
    datasets: [
      {
        data: gearData2,
        backgroundColor: [
          "#cc0",
          "#c60",
          "#c00",
          "#c0c",
          "#60c",
          "#00c",
          "#06c",
          "#0cc",
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
          /* warm */
          "#c90",
          "#fc3",
          "#fc0",
          "#f90",
          /* orange */
          "#f60",
          "#f30",
          "#f63",
          "#c30",
          /* magenta */
          "#c03",
          "#f36",
          "#f03",
          "#f06",
          /* red-violet */
          "#f09",
          "#f0c",
          "#f3c",
          "#c09",
          /* */
          "#90c",
          "#c3f",
          "#c0f",
          "#90f",
          /* cool - violet */
          "#60f",
          "#63f",
          "#30c",
          "#30f",
          /* */
          "#03c",
          "#03f",
          "#36f",
          "#06f",
          /* cold */
          "#09f",
          "#0cf",
          "#09c",
          "#3cf",
          /*  */
          "#3fc",
          "#0fc",
          "#0f9",
          "#0c9",
          /* unused for now */
          "#0f6",
          "#0f3",
          "#3f6",
          "#0c3",
          "#3c0",
          "#6f3",
          "#3f0",
          "#6f0",
          "#9f0",
          "#cf0",
          "#cf3",
          "#9c0",
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
