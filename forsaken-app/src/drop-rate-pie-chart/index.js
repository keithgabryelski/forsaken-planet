import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Chart } from "primereact/chart";
import ChartDataLabels from "chartjs-plugin-datalabels";
import DungeonsOfEternityCache from "../models/DungeonsOfEternityCache";
import { gearSlotPlacement } from "../models/DungeonsOfEternityCache";

export default function DoughnutChartDemo() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        labels: [],
        data: [],
      },
      {
        labels: [],
        data: [],
      },
      {
        labels: [],
        data: [],
      },
    ],
  });
  const [chartOptions, setChartOptions] = useState({});

  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailedToLoad] = useState(false);
  const [cache, setCache] = useState(new DungeonsOfEternityCache());

  useEffect(() => {
    const fetcher = async () => {
      const newCache = await DungeonsOfEternityCache.Factory();
      if (newCache == null) {
        setFailedToLoad(true);
        return;
      }
      setCache(newCache);
      setLoading(false);
    };

    fetcher();
  }, []);

  useEffect(() => {
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          formatter: function (value, context) {
            const { labels } = context.chart.data;
            const index = context.dataIndex;
            const data = context.dataset.data;
            const label = labels[index];
            const datum = data[index];
            return label + ":\n" + Math.round(datum * 10000) / 100 + "%";
          },
          color: "white",
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              return ` ${Math.round(context.parsed * 10000) / 100}%`;
            },
          },
        },
      },
    };
    setChartOptions(options);

    const gearSlotLabels = [
      ...[...Object.values(gearSlotPlacement)]
        .reduce((a, e) => a.add(e), new Set())
        .values(),
    ].sort();
    const gearSlotValues = gearSlotLabels.map(
      (slotName) =>
        cache.statistics.slots[slotName] / cache.statistics.totalDrops,
    );
    const entries = Object.entries(gearSlotPlacement).sort(
      ([e1g, e1s], [e2g, e2s]) => {
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
      },
    );
    const gearByBackThenHip = entries.map((e) => e[0]);
    const gear3DataLabels = gearByBackThenHip
      .map((groupName) => {
        const gearDrops = cache.indexes.byGroup.get(groupName) ?? [];
        const names = [...new Set(gearDrops.map((g) => g.Name))].sort();
        return names;
      })
      .flat();
    const gearData2 = gearByBackThenHip.map((g) => {
      return cache.statistics.byGroup?.get(g);
    });

    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: [...gear3DataLabels, ...gearByBackThenHip, ...gearSlotLabels],
      datasets: [
        {
          labels: gear3DataLabels,
          data: gear3DataLabels.map((l) => cache.statistics.byName.get(l)),
          backgroundColor: [
            documentStyle.getPropertyValue("--red-900"),
            documentStyle.getPropertyValue("--red-800"),
            documentStyle.getPropertyValue("--red-700"),
            documentStyle.getPropertyValue("--red-600"),
            documentStyle.getPropertyValue("--red-500"),
            documentStyle.getPropertyValue("--red-400"),
            documentStyle.getPropertyValue("--red-300"),
            documentStyle.getPropertyValue("--yellow-200"),
            documentStyle.getPropertyValue("--yellow-300"),
            documentStyle.getPropertyValue("--yellow-400"),
            documentStyle.getPropertyValue("--yellow-500"),
            documentStyle.getPropertyValue("--yellow-600"),
            documentStyle.getPropertyValue("--yellow-700"),
            documentStyle.getPropertyValue("--yellow-800"),
            documentStyle.getPropertyValue("--yellow-900"),
            documentStyle.getPropertyValue("--orange-900"),
            documentStyle.getPropertyValue("--orange-800"),
            documentStyle.getPropertyValue("--orange-700"),
            documentStyle.getPropertyValue("--orange-600"),
            documentStyle.getPropertyValue("--orange-800"),

            documentStyle.getPropertyValue("--blue-900"),
            documentStyle.getPropertyValue("--blue-800"),
            documentStyle.getPropertyValue("--blue-700"),
            documentStyle.getPropertyValue("--blue-600"),
            documentStyle.getPropertyValue("--blue-500"),

            documentStyle.getPropertyValue("--green-400"),
            documentStyle.getPropertyValue("--green-500"),
            documentStyle.getPropertyValue("--green-600"),
            documentStyle.getPropertyValue("--green-700"),
            documentStyle.getPropertyValue("--green-800"),
            documentStyle.getPropertyValue("--green-900"),
            documentStyle.getPropertyValue("--purple-900"),
            documentStyle.getPropertyValue("--purple-800"),
            documentStyle.getPropertyValue("--purple-700"),
            documentStyle.getPropertyValue("--purple-600"),
          ],
        },
        {
          labels: gearByBackThenHip,
          data: gearData2,
          backgroundColor: [
            documentStyle.getPropertyValue("--red-800"),
            documentStyle.getPropertyValue("--red-600"),
            documentStyle.getPropertyValue("--red-400"),
            documentStyle.getPropertyValue("--red-200"),
            documentStyle.getPropertyValue("--blue-800"),
            documentStyle.getPropertyValue("--blue-600"),
            documentStyle.getPropertyValue("--blue-400"),
            documentStyle.getPropertyValue("--blue-200"),
          ],
        },
        {
          labels: gearSlotLabels,
          data: gearSlotValues,
          backgroundColor: [
            documentStyle.getPropertyValue("--red-800"),
            documentStyle.getPropertyValue("--blue-800"),
          ],
        },
      ],
    };

    setChartData(data);
    setChartOptions(options);
  }, [cache]);

  if (failedToLoad) {
    return <p>bummer</p>;
  }

  if (loading) {
    return null;
  }
  return (
    <Container fluid>
      <Chart
        plugins={[ChartDataLabels]}
        type="pie"
        data={chartData}
        options={chartOptions}
      />
      <h2>Notes:</h2>
      <p>click on items in legend to hide them</p>
    </Container>
  );
}
