"use client";
import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";

export default function Renderer({ reports }) {
  const [cache, setCache] = useState(new DungeonsOfEternityCache());
  const [chartType, setChartType] = useState("scatter");
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const chartTypes = [
    { name: "Scatter", code: "scatter" },
    { name: "Bubble", code: "bubble" },
  ];

  useEffect(() => {
    const newCache = new DungeonsOfEternityCache(reports);
    setCache(newCache);
  }, [reports]);

  useEffect(() => {
    const labels = [...cache.indexes.byGroup.keys()]
      .filter((g) => g !== "shields")
      .sort();
    const datasets = labels.map((label, i) => {
      const drops = cache.indexes.byGroup.get(label);
      if (chartType === "scatter") {
        const data = drops.map((drop) => {
          const x = i * 20 + Math.random() * 18 - 9;
          const y = drop.Damage;
          return {
            x,
            y,
          };
        });
        return {
          label,
          data,
        };
      } else {
        const dataMap = drops.reduce((accumulator, drop) => {
          const x = i * 20 - 1;
          const y = drop.Damage;
          const key = `${i}/${y}`;
          const datum = accumulator.get(key) ?? {
            x,
            y,
            r: 0,
          };
          datum.r += 1;
          accumulator.set(key, datum);
          return accumulator;
        }, new Map());
        return {
          label,
          data: [...dataMap.entries()]
            .sort((a, b) => b[0] - a[0])
            .map(([a, b]) => b),
        };
      }
    });

    const data = {
      labels,
      datasets,
    };
    const options = {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, ticks) {
              if (index === 0) {
                return "";
              }
              return labels[index - 1];
            },
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Weapon's Damage Scatter Plot",
        },
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const label = labels[context.datasetIndex];
              const damage = context.raw.y;
              if (chartType === "scatter") {
                return ` ${label}: ${damage}`;
              }
              const numDrops = context.raw.r;
              return ` ${label}: ${damage} (drops seen: ${numDrops})`;
            },
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [cache.indexes.byGroup, chartType]);

  return (
    <div>
      <div className="card flex justify-content-center">
        <Dropdown
          value={chartType}
          onChange={(e) => setChartType(e.value.code)}
          options={chartTypes}
          optionLabel="name"
          placeholder="Select a Chart Type"
          className="w-full md:w-14rem"
        />
      </div>
      <Chart type={chartType} data={chartData} options={chartOptions} />
    </div>
  );
}
