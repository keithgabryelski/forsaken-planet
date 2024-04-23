"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import styles from "./styles.module.css";

Chart.register(ArcElement);

export default function Renderer({
  slotData,
  slotOptions,
  groupData,
  groupOptions,
  gearData,
  gearOptions,
}) {
  const plugins = [ChartDataLabels];

  slotOptions.plugins.datalabels.formatter =
    groupOptions.plugins.datalabels.formatter =
    gearOptions.plugins.datalabels.formatter =
      function (_value, context) {
        const { labels } = context.chart.data;
        const index = context.dataIndex;
        const data = context.dataset.data;
        const label = labels[index];
        const datum = data[index];
        return label + ":\n" + Math.round(datum * 10000) / 100 + "%";
      };

  return (
    <div className={styles.container}>
      <div className={styles.slot}>
        <Doughnut plugins={plugins} data={slotData} options={slotOptions} />
      </div>
      <div className={styles.group}>
        <Doughnut plugins={plugins} data={groupData} options={groupOptions} />
      </div>
      <div className={styles.gear}>
        <Doughnut plugins={plugins} data={gearData} options={gearOptions} />
      </div>
    </div>
  );
}
