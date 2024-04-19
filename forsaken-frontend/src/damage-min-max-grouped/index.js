import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import ChartDataLabels from "chartjs-plugin-datalabels";
import DungeonsOfEternityCache from "../models/DungeonsOfEternityCache";

export default function DamageMINMAX() {
  const [cache, setCache] = useState(new DungeonsOfEternityCache());
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailedToLoad] = useState(false);

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

  const dataSources = [
    { name: "Rare", code: "rare" },
    { name: "Legendary", code: "legendary" },
  ];

  const [chartDataSource, setChartDataSource] = useState("rare");
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (loading) {
      return;
    }
    const names = [...cache.indexes.byName.entries()]
      .filter(
        ([n, drops]) =>
          drops[0]?.Group !== "shields" &&
          !["ice staff", "healing staff"].includes(n),
      )
      .map((e) => e[0]);

    const index = cache.indexes.byName;
    const initializer = names.reduce((accumulator, name) => {
      const drops = cache.indexes.byName.get(name);
      const drop = drops[0];
      const groupName = drop.Group;
      (accumulator[groupName] = accumulator[groupName] ?? {})[name] = [
        null,
        null,
      ];
      return accumulator;
    }, {});

    const datasetEntries = [...index.entries()].reduce((damages, entry) => {
      const [groupName, drops] = entry;
      for (const drop of drops) {
        const { Rarity, Damage, Name, Group } = drop;
        if (Rarity === chartDataSource && Damage) {
          let minmax = damages[Group][Name];
          if (minmax == null) {
            console.warn("!!!no data for named", groupName, Name);
          } else if (minmax[0] == null) {
            damages[Group][Name] = [Damage, Damage];
          } else {
            const [min, max] = minmax;
            damages[Group][Name] = [
              Math.min(min, Damage),
              Math.max(max, Damage),
            ];
          }
        }
      }

      return damages;
    }, initializer);

    const labels = [...Object.keys(datasetEntries)];
    const colors = [
      "#990000",
      "#ff6600",
      "#009900",
      "#000099",
      "#0066ff",
      "#ff0066",
      "#6600ff",
      "#33aa66",
    ];

    const tooltips = [];
    const datasets = [];
    const datas = [];
    for (let i = 0; i < 6; ++i) {
      let label = "unknown";
      let tooltip = [];
      const data = labels.map((groupName, ii) => {
        label = groupName;
        const datasetEntry = datasetEntries[groupName];
        const namedEntries = Object.entries(datasetEntry).sort((a, b) => {
          const aminmax = a[1];
          const bminmax = b[1];
          const diff = aminmax[1] - bminmax[1];
          if (diff) {
            return diff;
          }
          return aminmax[0] - bminmax[0];
        });
        let stackEntry = namedEntries[i];
        if (!stackEntry) {
          stackEntry = ["unknown", [0, 0]];
        }
        tooltip.push({
          i,
          label,
          groupName,
          stackEntry,
          name: stackEntry[0],
        });
        (datas[i] = datas[i] || [])[ii] = tooltip;
        return stackEntry[1];
      });
      //        .filter(Boolean);
      tooltips.push(tooltip);
      datasets.push({
        label,
        backgroundColor: colors,
        borderColor: ["#ffffff"],
        borderWidth: 1,
        borderSkipped: false,
        data,
      });
    }
    datasets.map((dataset) => (dataset.opaque = datasets));

    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary",
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const data = {
      labels,
      datasets,
    };
    const options = {
      plugins: {
        title: {
          display: true,
          text: "Weapon's Damage MIN/MAX Grouped",
        },
        datalabels: {
          weight: "bold",
          color: "white",
          formatter: function (value, context) {
            if (value.length === 0 || value[0] === 0) {
              return "";
            }
            return `${value[1]}\n${value[0]}`;
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              //const [min, max] = context.raw;
              const data = tooltips[context.datasetIndex];
              const datum = data[context.dataIndex];
              if (!datum) {
                return "";
              }
              const { stackEntry } = datum;
              const [name, minmax] = stackEntry;
              const [min, max] = minmax;
              return ` ${name} range: ${min}-${max}`;
            },
          },
        },
        legend: {
          display: false,
        },
      },
      indexAxis: "x",
      responsive: true,
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Weapon Group",
          },
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

  if (failedToLoad) {
    return <p>bummer</p>;
  }

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
    </div>
  );
}
