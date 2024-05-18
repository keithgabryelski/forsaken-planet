"use client";
import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import { ColorPairs as colors } from "@/models/Colors";

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
          const offset = drop.Rarity === "rare" ? 9 : 18;
          const x = i * 20 + Math.random() * 9 + offset;
          const y = drop.Damage;
          return {
            x,
            y,
            drop,
          };
        });
        return {
          label,
          data,
          backgroundColor: data.map(
            (datum) => colors[i][datum.drop.Rarity === "rare" ? 0 : 1],
          ),
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
            drop,
          };
          datum.r += 1;
          accumulator.set(key, datum);
          return accumulator;
        }, new Map());
        const data = [...dataMap.entries()]
          .sort((a, b) => b[0] - a[0])
          .map(([_a, b]) => b);
        return {
          label,
          data,
          backgroundColor: data.map((_datum) => colors[i][1]),
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
            callback: function (_value, index, _ticks) {
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
          display: true,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              let label = labels[context.datasetIndex];
              if (context.raw.drop.Group === "crossbows") {
                if (
                  context.raw.drop.Perk1 === "reload" ||
                  context.raw.drop.Perk2 === "reload"
                ) {
                  label = `reload ${label}`;
                }
              }
              const damage = context.raw.y;
              const rarity = context.raw.drop.Rarity;
              if (chartType === "scatter") {
                return ` ${rarity} ${label}: ${damage}`;
              }
              const numDrops = context.raw.r;
              return ` ${rarity} ${label}: ${damage} (drops seen: ${numDrops})`;
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
          className="w-full md:w-20rem"
        />
      </div>
      <Chart type={chartType} data={chartData} options={chartOptions} />
    </div>
  );
}
