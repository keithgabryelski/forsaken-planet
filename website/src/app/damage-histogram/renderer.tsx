"use client";
import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Slider } from "primereact/slider";
import { InputText } from "primereact/inputtext";
import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import { type DOEReport } from "@/models/DungeonsOfEternityCache";
import update from "immutability-helper";
import { colors } from "@/models/Colors";

const NUM_VALUES = 200;
const NUM_BUCKETS = 200;
const NUM_BUCKET_SIZE = NUM_VALUES / NUM_BUCKETS;

export default function Renderer({ reports }: { reports: DOEReport[] }) {
  const [chartData, setChartData] = useState({});
  const [legendItems, setLegendItems] = useState([]);
  const [numBuckets, setNumBuckets] = useState(NUM_BUCKETS);
  const [bucketSize, setBucketSize] = useState(NUM_BUCKET_SIZE);
  const [chartOptions, setChartOptions] = useState({});
  const [cache, setCache] = useState(new DungeonsOfEternityCache());

  useEffect(() => {
    const newCache = new DungeonsOfEternityCache(reports);
    setCache(newCache);
  }, [reports]);

  useEffect(() => {
    setLegendItems(
      [...cache.indexes.byHuman.keys()]
        .filter((name) => name !== "shields")
        .map((name, index) => ({
          text: name,
          datasetIndex: 0,
          index,
          hidden: false,
          fillStyle: colors[index * 3 + 1],
          fontColor: "grey",
          lineWidth: 1,
          strokeStyle: "white",
        })),
    );
  }, [cache]);

  useEffect(() => {
    setBucketSize(NUM_VALUES / numBuckets);
  }, [numBuckets]);

  useEffect(() => {
    let minDamage = -1;
    let maxDamage = -1;

    const legendNames = legendItems
      .filter((item) => !item.hidden)
      .map((item) => item.text);

    const buckets = Array(numBuckets).fill(0);

    const damageDrops = [...cache.indexes.byDamage.entries()].filter(
      ([_n, drops]) => drops[0].doesDamage,
    );
    for (const [damage, drops] of damageDrops) {
      if (minDamage === -1 || damage < minDamage) {
        minDamage = damage;
      }
      if (maxDamage < damage) {
        maxDamage = damage;
      }
      buckets[Math.floor(damage / bucketSize)] = drops.filter((drop) =>
        legendNames.includes(drop.Human),
      ).length;
    }

    const x_vals = Array.from(
      { length: numBuckets },
      (_value, index) => index * bucketSize + 0.5 * bucketSize,
    );
    const y_vals = buckets;
    const dataVals = x_vals.map((k, i) => ({ x: k, y: y_vals[i] }));

    const backgroundColor = Array(x_vals.length).fill(
      "rgba(255, 99, 132, 0.2)",
    );
    const borderColor = Array(x_vals.length).fill("rgba(255, 99, 132, 1)");

    // backgroundColor[parseInt(x_vals.length / 2)] = "rgba(54, 162, 235, 0.2)";
    // borderColor[parseInt(x_vals.length / 2)] = "rgba(54, 162, 235, 1)";

    const minBucket = Math.floor(minDamage / bucketSize);
    const maxBucket = Math.floor(maxDamage / bucketSize);
    const median = minBucket + (maxBucket - minBucket) / 2;
    const medianFloorBucket = Math.floor(median);
    const medianCeilingBucket = Math.ceil(median);

    backgroundColor[medianFloorBucket] = "rgba(54, 162, 235, 0.2)";
    borderColor[medianFloorBucket] = "rgba(54, 162, 235, 1)";
    backgroundColor[medianCeilingBucket] = "rgba(54, 162, 235, 0.2)";
    borderColor[medianCeilingBucket] = "rgba(54, 162, 235, 1)";

    const data = {
      legendItems,

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
          title: {
            text: "Damage Histogram",
            display: true,
            color: "white",
            font: {
              size: 24,
            },
          },

          display: true,
          onClick: (_event, legendItem, legend) => {
            const newItems = update(legendItems, {
              [legendItem.index]: {
                hidden: {
                  $set: !legendItems[legendItem.index].hidden,
                },
              },
            });
            setLegendItems(newItems);
            legend.chart.update();
          },

          labels: {
            generateLabels: (_chart) => {
              return legendItems;
            },
          },
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
  }, [cache.indexes.byDamage, legendItems, numBuckets, bucketSize]);

  return (
    <div>
      <label>Buckets:</label>
      <span
        className="p-3 shadow-2 mb-3 inline-block"
        style={{ borderRadius: "10px" }}
      >
        <InputText
          value={numBuckets}
          onChange={(e) => setNumBuckets(e.target.value)}
        />
        <Slider
          value={numBuckets}
          min={1}
          max={NUM_VALUES}
          onChange={(e) => setNumBuckets(e.value)}
        />
      </span>
      <Chart type="bar" data={chartData} options={chartOptions} />
    </div>
  );
}
