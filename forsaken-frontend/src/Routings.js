import { Route } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import ChartGallery from "./ChartGallery";
import DropRateCalculator from "./drop-rate-calculator/DropRateCalculator";
import Drops from "./drops";
import DropRatePieChart from "./drop-rate-pie-chart";
import PerkDropRateRadar from "./perk-drop-rate-radar";
import DamageMINMAX from "./damage-min-max";
import DamageMINMAXGrouped from "./damage-min-max-grouped";
import DamageScatterPlot from "./damage-scatter-plot";
import DamageTypePieChart from "./damage-type-pie-chart";
import Simulator from "./simulator";
import Meanderings from "./meanderings";

class Routing {
  constructor(title, href, element, disabled = false) {
    this.title = title;
    this.href = href;
    this.element = element;
    this.disabled = disabled;
  }

  get path() {
    return this.href.replace(/^#/, "");
  }
}

const routings = [
  new Routing(
    "Drop Rate Calculator",
    "#/drop-rate-calculator",
    <DropRateCalculator />,
  ),
  new Routing(
    "Drop Rate Pie Chart",
    "#/drop-rate-pie-chart",
    <DropRatePieChart />,
  ),
  new Routing(
    "Perk Drop Rate Radar",
    "#/perk-drop-rate-radar",
    <PerkDropRateRadar />,
  ),
  new Routing("Damage MIN/MAX", "#/damage-min-max", <DamageMINMAX />),
  new Routing(
    "Damage MIN/MAX Grouped",
    "#/damage-min-max-grouped",
    <DamageMINMAXGrouped />,
  ),
  new Routing(
    "Damage Scatter Plot",
    "#/damage-scatter-plot",
    <DamageScatterPlot />,
  ),
  new Routing("Drops Investigator", "#/drops", <Drops />),
  new Routing(
    "Damage Type Pie Chart",
    "#/damage-type-pie-chart",
    <DamageTypePieChart />,
  ),
  new Routing("Simulator", "#/simulator", <Simulator />),
  new Routing("Gallery", "#/gallery", <ChartGallery />),
  new Routing(
    "Protagosus' Statistical Guides and Magical Meanderings",
    "#/meanderings",
    <Meanderings />,
  ),
];

export const MeanderingNavs = routings
  .filter((r) => !r.disabled)
  .map((r) => (
    <NavDropdown.Item key={r.title} href={r.href}>
      {r.title}
    </NavDropdown.Item>
  ));

export const MeanderingRoutes = routings
  .filter((r) => !r.disabled)
  .map((r) => <Route key={r.title} path={r.path} element={r.element} />);
