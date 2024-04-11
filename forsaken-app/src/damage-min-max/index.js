import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import ChartDataLabels from "chartjs-plugin-datalabels";
import DungeonsOfEternityCache from "../models/DungeonsOfEternityCache";

export default function StackedBarDemo() {
  const [cache, setCache] = useState(new DungeonsOfEternityCache());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      const url = new URL(window.location.origin);
      url.port = 3001;
      url.pathname = "/reports";
      const fetched = await fetch(url, {
        method: "GET",
      });
      const json = await fetched.json();
      const newCache = new DungeonsOfEternityCache(json);
      setCache(newCache);
      setLoading(false);
    };

    fetcher();
  }, []);

  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const ds = [...cache.indexes.byGroup.entries()].reduce(
      (damages, entry) => {
        const [groupName, drops] = entry;
        for (const drop of drops) {
          const { Rarity, Damage } = drop;
          if (Damage) {
            const minmax = damages[Rarity][groupName];
            if (minmax[0] == null) {
              damages[Rarity][groupName] = [Damage, Damage];
            } else {
              const [min, max] = minmax;
              damages[Rarity][groupName] = [
                Math.min(min, Damage),
                Math.max(max, Damage),
              ];
            }
          }
        }

        return damages;
      },
      {
        rare: {
          staves: [null, null],
          daggers: [null, null],
          axes: [null, null],
          bows: [null, null],
          crossbows: [null, null],
          swords: [null, null],
          hammers: [null, null],
        },
        legendary: {
          staves: [null, null],
          daggers: [null, null],
          axes: [null, null],
          bows: [null, null],
          crossbows: [null, null],
          swords: [null, null],
          hammers: [null, null],
        },
      },
    );

    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary",
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const baseLabels = [...Object.keys(ds.rare)];
    const labels = baseLabels
      .map((g) => [`rare ${g}`, `legendary ${g}`])
      .flat();

    const datamax = baseLabels
      .map((g) => [
        [ds.rare[g][0], ds.rare[g][1]],
        [ds.legendary[g][0], ds.legendary[g][1]],
      ])
      .flat();

    const data = {
      labels,
      datasets: [
        {
          type: "bar",
          label: "Min/Max",
          backgroundColor: [
            "#333300",
            "#555500",
            "#006600",
            "#009900",
            "#003333",
            "#005555",
            "#000066",
            "#000099",
            "#330033",
            "#550055",
            "#660000",
            "#990000",
            "#ff6600",
            "#ff8800",
          ],
          data: datamax,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        datalabels: {
          anchor: "start", // Anchor the labels to the start of the datapoint
          align: "end", // Align the text after the anchor point
          color: "white",
          formatter: function (value, context) {
            // Show the label instead of the value
            return `${value[1]}\n${value[0]}`;
          },
        },

        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const [min, max] = context.raw;
              return ` range: ${min}-${max}`;
            },
          },
        },
        legend: {
          display: false,
        },
      },
      indexAxis: "x",
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [cache.indexes.byGroup]);

  if (loading) {
    return null;
  }
  return (
    <div className="card">
      <Chart
        plugins={[ChartDataLabels]}
        type="bar"
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}
