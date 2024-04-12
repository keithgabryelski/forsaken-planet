import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import ChartDataLabels from "chartjs-plugin-datalabels";
import DungeonsOfEternityCache from "../models/DungeonsOfEternityCache";

export default function DamageMINMAX() {
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

  const dataSources = [
    { name: "Group", code: "group" },
    { name: "Name", code: "name" },
  ];

  const [chartDataSource, setChartDataSource] = useState("group");
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (loading) {
      return;
    }
    const groupNames = [...cache.indexes.byGroup.keys()].filter(
      (n) => n !== "shields",
    );
    const names = [...cache.indexes.byName.entries()]
      .filter(
        ([n, drops]) =>
          drops[0]?.Group !== "shields" &&
          !["ice staff", "healing staff", "shockwave staff"].includes(n),
      )
      .map((e) => e[0]);
    console.info("groupNames", groupNames);
    console.info("names", names);

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

    let i = 0;
    const ds = [...index.entries()].reduce((damages, entry) => {
      const [groupName, drops] = entry;
      for (const drop of drops) {
        const { Rarity, Damage } = drop;
        if (Damage) {
          const minmax = damages[Rarity][groupName];
          if (minmax == null) {
            console.info("not found", groupName);
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

      console.info("***", i++, JSON.stringify(damages, undefined, 2));
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
          data: labels
            .map((g) => [ds.legendary[g][0], ds.legendary[g][1]])
            .map((l, i) =>
              l[0] == null ? [ds.rare[labels[i]][0], ds.rare[labels[i]][1]] : l,
            ),
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      responsive: true,
      interaction: {
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: "Weapon's Damage MIN/MAX",
        },
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
          display: true,
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
  }, [chartDataSource, cache.indexes.byGroup, cache.indexes.byName, loading]);

  if (loading) {
    return null;
  }
  return (
    <div>
      <div className="card flex justify-content-center">
        <Dropdown
          value={chartDataSource}
          onChange={(e) => setChartDataSource(e.value.code)}
          options={dataSources}
          optionLabel="name"
          placeholder="Select a Datasource"
          className="w-full md:w-14rem"
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
