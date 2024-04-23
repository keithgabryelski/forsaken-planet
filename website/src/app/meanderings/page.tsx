import Image from "next/image";
import DropRateCalculator from "../../assets/images/drop-rate-calculator.png";
import DamageMINMAX from "../../assets/images/damage-min-max.png";
import DamageMINMAXGrouped from "../../assets/images/damage-min-max-grouped.png";
import DropRatePieChart from "../../assets/images/drop-rate-pie-chart.png";
import DamageScatterPlot from "../../assets/images/damage-scatter-plot.png";
import DropsTable from "../../assets/images/drops-table.png";
import DamageTypePieChart from "../../assets/images/damage-type-pie-chart.png";
import PerkDropRateRadar from "../../assets/images/perk-drop-rate-radar.png";

export default function Meanderings() {
  return (
    <div className="surface-0 text-center">
      <div className="mb-3 font-bold text-3xl">
        <span className="text-900">Protagosus&apos; Statistical Charts </span>
        <span className="text-900">and Magical Meanderings</span>
      </div>
      <div className="text-700 mb-6">
        From gear drop rates to weapon&apos;s damage ranges. Examine all aspects
        of the chest drops using live tools. Or, download a CSV of all the data
        we use and do your own calcuations
      </div>
      <div className="grid">
        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <a href="/drop-rate-calculator">
              <Image
                src={DropRateCalculator}
                width={64}
                alt="drop rate calculator"
              />
            </a>
          </span>
          <div className="text-900 text-xl mb-3 font-medium">
            Drop Rate Calculator
          </div>
          <span className="text-700 line-height-3">
            Use live data to determine how many drops it will take for a weapon
            with specific features and perks to be seen.
          </span>
        </div>
        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <a href="/damage-min-max">
              <Image src={DamageMINMAX} width={128} alt="damage min/max" />
            </a>
          </span>
          <div className="text-900 text-xl mb-3 font-medium">
            Weapon&apos;s Damage MIN/MAX
          </div>
          <span className="text-700 line-height-3">
            Examine ranges of damage by weapon&apos;s group and name.
          </span>
        </div>
        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <a href="/damage-min-max-grouped">
              <Image
                src={DamageMINMAXGrouped}
                width={128}
                alt="damage minmax grouped"
              />
            </a>
          </span>
          <div className="text-900 text-xl mb-3 font-medium">
            Weapon&apos;s Damage MIN/MAX Grouped
          </div>
          <span className="text-700 line-height-3">
            Examine ranges of damage by weapon&apos;s group.
          </span>
        </div>
        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <a href="/drop-rate-pie-chart">
              <Image
                src={DropRatePieChart}
                width={128}
                alt="drop rate pie chart"
              />
            </a>
          </span>
          <div className="text-900 text-xl mb-3 font-medium">
            Drop Rate Pie Chart
          </div>
          <span className="text-700 line-height-3">
            Weapon&apos;s drop rate by group and name.
          </span>
        </div>
        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <a href="/damage-scatter-plot">
              <Image
                src={DamageScatterPlot}
                width={128}
                alt="damage scatter plot"
              />
            </a>
          </span>
          <div className="text-900 text-xl mb-3 font-medium">
            Damage Scatter Plot
          </div>
          <span className="text-700 line-height-3">
            Examine damage grouped in a scatter or bubble chart.
          </span>
        </div>
        <div className="col-12 md:col-4 md:mb-4 mb-0 px-3">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <a href="/drops-interrogator">
              <Image src={DropsTable} width={128} alt="drops table" />
            </a>
          </span>
          <div className="text-900 text-xl mb-3 font-medium">Drops Table</div>
          <span className="text-700 line-height-3">
            Interrogate all live data which backs this site&apos;s statistics.
          </span>
        </div>

        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <a href="/damage-type-pie-chart">
              <Image
                src={DamageTypePieChart}
                width={128}
                alt="damage type pie chart"
              />
            </a>
          </span>
          <div className="text-900 text-xl mb-3 font-medium">
            Damage Type Pie Chart
          </div>
          <span className="text-700 line-height-3">
            Drop rate for damage types.
          </span>
        </div>

        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <a href="/perk-drop-rate-radar">
              <Image
                src={PerkDropRateRadar}
                width={128}
                alt="perk drop-rate radar"
              />
            </a>
          </span>
          <div className="text-900 text-xl mb-3 font-medium">
            Perk Drop Rate Radar
          </div>
          <span className="text-700 line-height-3">
            Chance of receiving specific perks given a weapon&apos;s drop.
          </span>
        </div>
      </div>
    </div>
  );
}
