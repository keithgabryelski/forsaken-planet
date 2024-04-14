import { Image } from "react-bootstrap";
import DropRateCalculator from "../assets/images/drop-rate-calculator.png";
import DamageMINMAX from "../assets/images/damage-min-max.png";
import DamageMINMAXGrouped from "../assets/images/damage-min-max-grouped.png";
import DropRatePieChart from "../assets/images/drop-rate-pie-chart.png";
import DamageScatterPlot from "../assets/images/damage-scatter-plot.png";
import DropsTable from "../assets/images/drops-table.png";

export default function Tools() {
  return (
    <div className="surface-0 text-center">
      <div className="mb-3 font-bold text-3xl">
        <span className="text-900">Live Data Tools, </span>
        <span className="text-blue-600">Statistical Charts</span>
      </div>
      <div className="text-700 mb-6">
        From gear drop rates to weapon's damage ranges. Examine all aspects of
        the chest drops using live tools. Or, download a CSV of all the data we
        use and do your own calcuations
      </div>
      <div className="grid">
        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <a href="#/drop-rate-calculator">
              <Image src={DropRateCalculator} width={64} />
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
            <a href="#/damage-min-max">
              <Image src={DamageMINMAX} width={128} />
            </a>
          </span>
          <div className="text-900 text-xl mb-3 font-medium">
            Weapon's Damage MIN/MAX
          </div>
          <span className="text-700 line-height-3">
            Examine ranges of damage by weapon's group and name.
          </span>
        </div>
        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <a href="#/damage-min-max-grouped">
              <Image src={DamageMINMAXGrouped} width={128} />
            </a>
          </span>
          <div className="text-900 text-xl mb-3 font-medium">
            Weapon's Damage MIN/MAX Grouped
          </div>
          <span className="text-700 line-height-3">
            Examine ranges of damage by weapon's group.
          </span>
        </div>
        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <a href="#/drop-rate-pie-chart">
              <Image src={DropRatePieChart} width={128} />
            </a>
          </span>
          <div className="text-900 text-xl mb-3 font-medium">
            Drop Rate Pie Chart
          </div>
          <span className="text-700 line-height-3">
            Weapon's drop rate by group and name.
          </span>
        </div>
        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <a href="#/damage-scatter-plot">
              <Image src={DamageScatterPlot} width={128} />
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
            <a href="#/damage-scatter-plot">
              <Image src={DropsTable} width={128} />
            </a>
          </span>
          <div className="text-900 text-xl mb-3 font-medium">Drops Table</div>
          <span className="text-700 line-height-3">
            Interrogate all live data which backs this site's statistics.
          </span>
        </div>
      </div>
    </div>
  );
}
