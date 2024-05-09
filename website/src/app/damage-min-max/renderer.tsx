"use client";
import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import ChartDataLabels from "chartjs-plugin-datalabels";
import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";

export default function DamageMINMAX({ reports }) {
  const dataSources = [
    { name: "Group", code: "group" },
    { name: "Name", code: "name" },
  ];

  const [chartDataSource, setChartDataSource] = useState("group");
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [cache, setCache] = useState(new DungeonsOfEternityCache());

  useEffect(() => {
    const newCache = new DungeonsOfEternityCache(reports);
    setCache(newCache);
  }, [reports]);

  useEffect(() => {
    const groupNames = [...cache.indexes.byGroup.keys()].filter(
      (n) => n !== "shields",
    );
    const names = [...cache.indexes.byName.entries()]
      .filter(
        ([n, drops]) =>
          drops[0]?.Group !== "shields" &&
          !["ice staff", "healing staff"].includes(n),
      )
      .map((e) => e[0]);

    const chartDataSourceOptions = {
      group: {
        index: cache.indexes.byGroup,
        initializer: {
          rare: Object.fromEntries(groupNames.map((n) => [n, [null, null]])),
          legendary: Object.fromEntries(
            groupNames.map((n) => [n, [null, null]]),
          ),
        },
      },
      name: {
        index: cache.indexes.byName,
        initializer: {
          rare: Object.fromEntries(names.map((n) => [n, [null, null]])),
          legendary: Object.fromEntries(names.map((n) => [n, [null, null]])),
        },
      },
    };

    const { index, initializer } = chartDataSourceOptions[chartDataSource];

    const ds = [...index.entries()].reduce((damages, entry) => {
      const [groupName, drops] = entry;
      for (const drop of drops) {
        const { Rarity, Damage } = drop;
        if (Damage) {
          const minmax = damages[Rarity][groupName];
          if (minmax == null) {
            console.info("*", Rarity, groupName);
          } else if (minmax[0] == null) {
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
    }, initializer);

    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary",
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const labels = [...Object.keys(ds.rare)];

    const data = {
      labels,
      datasets: [
        {
          label: "rare",
          stack: "Stack 0",
          backgroundColor: ["#0000aa"],
          borderColor: ["#ffffff"],
          borderWidth: 1,
          borderSkipped: false,
          data: labels
            .map((g) => [ds.rare[g][0], ds.rare[g][1]])
            .map((l, i) =>
              l[0] == null
                ? [ds.legendary[labels[i]][0], ds.legendary[labels[i]][1]]
                : l,
            ),
        },
        {
          label: "legendary",
          stack: "Stack 1",
          backgroundColor: ["#550055"],
          borderColor: ["#ffffff"],
          borderWidth: 1,
          borderSkipped: false,
          data: labels
            .map((g) => [ds.legendary[g][0], ds.legendary[g][1]])
            .map((l, i) =>
              l[0] == null ? [ds.rare[labels[i]][0], ds.rare[labels[i]][1]] : l,
            ),
        },
      ],
    };
    const options = {
      plugins: {
        title: {
          display: true,
          text: "Weapon's Damage MIN/MAX",
        },
        datalabels: {
          weight: "bold",
          color: "white",
          formatter: function (value) {
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
          display: true,
        },
      },
      indexAxis: "x",
      scales: {
        x: {
          title: {
            display: true,
            text: "Weapon",
          },
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          title: {
            display: true,
            text: "Damage",
          },
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
  }, [chartDataSource, cache.indexes.byGroup, cache.indexes.byName]);

  return (
    <div>
      <div className="card flex justify-content-center">
        <Dropdown
          value={chartDataSource}
          onChange={(e) => setChartDataSource(e.value.code)}
          options={dataSources}
          optionLabel="name"
          placeholder="Select a Datasource"
          className="w-full md:w-20rem"
        />
      </div>
      <Chart
        plugins={[ChartDataLabels]}
        type="bar"
        data={chartData}
        options={chartOptions}
      />
      <h3>Notes:</h3>
      <p>Click on the legend to hide datasets</p>
    </div>
  );
}
