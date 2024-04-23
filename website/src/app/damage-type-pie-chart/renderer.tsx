"use client";
import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import ChartDataLabels from "chartjs-plugin-datalabels";
import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import styles from "./styles.module.css";

export default function DamageTypePieChart({ reports }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        labels: [],
        data: [],
      },
    ],
  });
  const [chartOptions, setChartOptions] = useState({});
  const [cache, setCache] = useState(new DungeonsOfEternityCache());

  useEffect(() => {
    const newCache = new DungeonsOfEternityCache(reports);
    setCache(newCache);
  }, [reports]);

  useEffect(() => {
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          formatter: function (_value, context) {
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

    const labels = ["physical", "poison", "fire", "ice"];
    const collatedDataTypes = cache.indexes.byDamageType.entries().reduce(
      (accumulator, [_name, drops]) => {
        return drops.reduce((acc, drop) => {
          if (["shields", "staves"].includes(drop.Group)) {
            return acc;
          }
          acc[drop.DamageType].push(drop);
          return acc;
        }, accumulator);
      },
      labels.reduce((a, i) => {
        a[i] = [];
        return a;
      }, {}),
    );
    const dataTypeValues = [...Object.values(collatedDataTypes)];
    const total = dataTypeValues.reduce(
      (accumulator, drops) => accumulator + drops.length,
      0,
    );
    const damageTypeEntries = [...Object.entries(collatedDataTypes)].map(
      ([damageType, drops]) => {
        return [damageType, drops.length / total];
      },
    );
    const values = damageTypeEntries.map((a) => a[1]);
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            documentStyle.getPropertyValue("--gray-800"),
            documentStyle.getPropertyValue("--green-400"),
            documentStyle.getPropertyValue("--red-900"),
            documentStyle.getPropertyValue("--blue-900"),
          ],
        },
      ],
    };

    setChartData(data);
    setChartOptions(options);
  }, [cache]);

  return (
    <div className={styles.container}>
      <Chart
        plugins={[ChartDataLabels]}
        type="pie"
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}
