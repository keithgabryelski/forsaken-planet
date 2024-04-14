import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import DungeonsOfEternityCache from "../models/DungeonsOfEternityCache";
import {
  gearPerksMatrix,
  perkGearMatrix,
  weaponPerks,
} from "../models/DungeonsOfEternityCache";

export default function PerkDropRateRadar() {
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailedToLoad] = useState(false);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [results, setResults] = useState([]);
  const [cache, setCache] = useState(new DungeonsOfEternityCache());

  useEffect(() => {
    const fetcher = async () => {
      const newCache = await DungeonsOfEternityCache.Factory();
      if (newCache == null) {
        setFailedToLoad(true);
        return;
      }
      setCache(newCache);
      setResults(newCache.drops);
      setLoading(false);
    };

    fetcher();
  }, []);

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary",
    );
    const labels = Object.keys(perkGearMatrix).sort((a, b) => {
      if (weaponPerks.includes(a)) {
        if (weaponPerks.includes(b)) {
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          return 0;
        }

        return -1;
      }
      if (weaponPerks.includes(b)) {
        return 1;
      }
      // neither are a weapon's perk
      // sort by weapon.

      const aa = perkGearMatrix[a].sort()[0];
      const bb = perkGearMatrix[b].sort()[0];
      if (aa < bb) {
        return -1;
      }
      if (aa > bb) {
        return 1;
      }
      return 0;
    });
    const gears = Object.keys(gearPerksMatrix);

    const data = {
      labels,
      datasets: gears
        .filter((a) => a !== "staves")
        .map((gearLabel) => {
          return {
            label: gearLabel,
            data: labels.map((perk) =>
              gearPerksMatrix[gearLabel].includes(perk)
                ? cache.statistics.perksDropsByWeapon[gearLabel][perk] * 100
                : 0,
            ),
          };
        }),
    };
    const options = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        r: {
          grid: {
            color: textColorSecondary,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [results, cache]);

  if (failedToLoad) {
    return <p>bummer</p>;
  }

  if (loading) {
    return null;
  }
  return (
    <div className="card flex justify-content-center">
      <Chart
        type="radar"
        data={chartData}
        options={chartOptions}
        className="w-full md:w-30rem"
      />
    </div>
  );
}
