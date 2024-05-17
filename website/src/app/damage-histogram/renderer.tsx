"use client";
import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import { type DOEReport } from "@/models/DungeonsOfEternityCache";

const NUM_VALUES = 200;
const NUM_BUCKETS = 200;
const NUM_BUCKET_SIZE = NUM_VALUES / NUM_BUCKETS;

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

  if (cache == null) {
    return null;
  }

  useEffect(() => {
    let minDamage = -1;
    let maxDamage = -1;

    const buckets = Array(NUM_BUCKETS).fill(0);

    const damageDrops = [...cache.indexes.byDamage.entries()].filter(
      ([n, drops]) => drops[0].doesDamage,
    );
    for (const [damage, drops] of damageDrops) {
      if (minDamage === -1 || damage < minDamage) {
        minDamage = damage;
      }
      if (maxDamage < damage) {
        maxDamage = damage;
      }
      buckets[Math.floor(damage / NUM_BUCKET_SIZE)] = drops.length;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary",
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const x_vals = Array.from(
      { length: NUM_BUCKETS },
      (value, index) => index * NUM_BUCKET_SIZE + 0.5 * NUM_BUCKET_SIZE,
    );
    const y_vals = buckets;
    const dataVals = x_vals.map((k, i) => ({ x: k, y: y_vals[i] }));

    const backgroundColor = Array(x_vals.length).fill(
      "rgba(255, 99, 132, 0.2)",
    );
    const borderColor = Array(x_vals.length).fill("rgba(255, 99, 132, 1)");

    // backgroundColor[parseInt(x_vals.length / 2)] = "rgba(54, 162, 235, 0.2)";
    // borderColor[parseInt(x_vals.length / 2)] = "rgba(54, 162, 235, 1)";

    const minBucket = Math.floor(minDamage / NUM_BUCKET_SIZE);
    const maxBucket = Math.floor(maxDamage / NUM_BUCKET_SIZE);
    const median = minBucket + (maxBucket - minBucket) / 2;
    const medianFloorBucket = Math.floor(
      minBucket + (maxBucket - minBucket) / 2,
    );
    const medianCeilingBucket = Math.ceil(
      minBucket + (maxBucket - minBucket) / 2,
    );

    backgroundColor[medianFloorBucket] = "rgba(54, 162, 235, 0.2)";
    borderColor[medianFloorBucket] = "rgba(54, 162, 235, 1)";
    backgroundColor[medianCeilingBucket] = "rgba(54, 162, 235, 0.2)";
    borderColor[medianCeilingBucket] = "rgba(54, 162, 235, 1)";

    const data = {
      datasets: [
        {
          label: "Number of drops seen",
          data: dataVals,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
          barPercentage: 1,
          categoryPercentage: 1,
          borderRadius: 5,
        },
      ],
    };
    const options = {
      scales: {
        x: {
          type: "linear",
          offset: false,
          grid: {
            offset: false,
          },
          ticks: {
            stepSize: 1,
          },
          title: {
            display: true,
            text: "Damage",
            font: {
              size: 14,
            },
          },
        },
        y: {
          // beginAtZero: true
          title: {
            display: true,
            text: "Drops",
            font: {
              size: 14,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            title: (items) => {
              if (!items.length) {
                return "";
              }
              const item = items[0];
              const x = item.parsed.x;
              const min = x - 0.5;
              const max = x + 0.5;
              return `Damage: ${min} - ${max}`;
            },
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [cache.indexes.byDamage]);

  return <Chart type="bar" data={chartData} options={chartOptions} />;
}
