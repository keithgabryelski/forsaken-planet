"use client";
import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import ChartDataLabels from "chartjs-plugin-datalabels";
import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import { type DOEReport } from "@/models/DungeonsOfEternityCache";

export default function Renderer({ reports }: { reports: DOEReport[] }) {
  const [chartDataSource, setChartDataSource] = useState({
    name: "All Rarities",
    code: "all",
  });
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [cache, setCache] = useState(new DungeonsOfEternityCache());

  useEffect(() => {
    const newCache = new DungeonsOfEternityCache(reports);
    setCache(newCache);
  }, [reports]);

  const dataSources = [
    { name: "All Rarities", code: "all" },
    { name: "Rare", code: "rare" },
    { name: "Legendary", code: "legendary" },
  ];

  const topAndBottomLabels = {
    id: "topAndBottomLabels",
    afterDatasetsDraw(chart, _args, _pluginOptions) {
      const {
        ctx,
        scales: { x, y },
      } = chart;
      if (x != null) {
        ctx.font = "bold 16px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";

        chart.data.datasets[0].data.forEach(([min, max], index) => {
          ctx.fillText(
            min.toString(),
            x.getPixelForValue(index),
            20 + y.getPixelForValue(min),
          );
          ctx.fillText(
            max.toString(),
            x.getPixelForValue(index),
            y.getPixelForValue(max) - 8,
          );
          //ctx.fillText(max.toString(), x.getPixelForValue(index), min + max);
        });
      }
    },
  };

  useEffect(() => {
    const names = [...cache.indexes.byHuman.entries()]
      .filter(([_n, drops]) => drops[0].doesDamage)
      .map((e) => e[0]);

    const index = cache.indexes.byHuman;
    const initializer = names.reduce((accumulator, name) => {
      const drops = cache.indexes.byHuman.get(name);
      const drop = drops[0];
      const groupName = drop.Human;
      accumulator[groupName] = accumulator[groupName] ?? [null, null];
      return accumulator;
    }, {});

    const datasetEntries = [...index.entries()].reduce((damages, entry) => {
      const [_groupName, drops] = entry;
      for (const drop of drops) {
        const { Rarity, Damage, Human } = drop;
        if (
          (chartDataSource.code === "all" || Rarity === chartDataSource.code) &&
          Damage
        ) {
          const minmax = damages[Human];
          if (minmax == null) {
            console.warn("!!!no data for named", Human);
          } else if (minmax[0] == null) {
            damages[Human] = [Damage, Damage];
          } else {
            const [min, max] = minmax;
            damages[Human] = [Math.min(min, Damage), Math.max(max, Damage)];
          }
        }
      }

      return damages;
    }, initializer);

    const labels = [...Object.keys(datasetEntries)].sort((a, b) => {
      const aMinMax = datasetEntries[a];
      const bMinMax = datasetEntries[b];
      const diff = bMinMax[1] - aMinMax[1];
      if (diff !== 0) {
        return diff;
      }
      return bMinMax[0] - aMinMax[0];
    });
    const colors = [
      "#8a033e",
      "#57a3fd",
      "#9a2001",
      "#194e31",
      "#5a1ba9",
      "#3a49da",
      "#91db8b",
      "#ad7bee",
      "#1af9ff",
    ];

    const tooltips = [];
    const datasets = [];
    const datas = [];

    let label = "unknown";
    const tooltip = [];
    const datasetData = labels.map((groupName, ii) => {
      label = groupName;
      const datasetEntry = datasetEntries[groupName];
      tooltip.push({
        label,
        groupName,
        stackEntry: datasetEntry,
        name: groupName,
      });
      datas[ii] = tooltip;
      return datasetEntry;
    });

    tooltips.push(tooltip);
    datasets.push({
      label,
      backgroundColor: colors,
      borderColor: ["#ffffff"],
      borderWidth: 1,
      borderSkipped: false,
      minBarLength: 2,
      data: datasetData,
    });

    //    datasets.map((dataset) => (dataset.opaque = datasets));

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
          text: "Weapon's Damage MIN/MAX by Grouping",
        },
        datalabels: {
          display: false,
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
              const { _name, stackEntry } = datum;
              const [min, max] = stackEntry;
              return ` range: ${min}-${max}`;
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
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [chartDataSource, cache.indexes.byHuman]);

  return (
    <div>
      <div className="card flex justify-content-center">
        <Dropdown
          value={chartDataSource}
          onChange={(e) => setChartDataSource(e.value)}
          options={dataSources}
          optionLabel="name"
          placeholder="Select a Datasource"
          className="w-full md:w-20rem"
        />
      </div>
      <Chart
        plugins={[ChartDataLabels, topAndBottomLabels]}
        type="bar"
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}
