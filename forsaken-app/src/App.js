import { PrimeReactProvider } from "primereact/api";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import ChartGallery from "./ChartGallery";
import Navigation from "./Navigation";
import Welcome from "./Welcome";
import DropRateCalculator from "./drop-rate-calculator/DropRateCalculator";
import Drops from "./drops/Drops";
import DropRatePieChart from "./drop-rate-pie-chart";
import PerkDropRateRadar from "./perk-drop-rate-radar";
import DamageMINMAX from "./damage-min-max";
import DamageMINMAXGrouped from "./damage-min-max-grouped";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

import "./App.css";

function App() {
  return (
    <PrimeReactProvider>
      <Container fluid>
        <Navigation />
        <Container>
          <Router>
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/damage-min-max" element={<DamageMINMAX />} />
              <Route
                path="/damage-min-max-grouped"
                element={<DamageMINMAXGrouped />}
              />
              <Route path="/drops" element={<Drops />} />
              <Route
                path="/drop-rate-calculator"
                element={<DropRateCalculator />}
              />
              <Route
                path="/drop-rate-pie-chart"
                element={<DropRatePieChart />}
              />
              <Route
                path="/perk-drop-rate-radar"
                element={<PerkDropRateRadar />}
              />
              <Route path="/gallery" element={<ChartGallery />} />
            </Routes>
          </Router>
        </Container>
      </Container>
    </PrimeReactProvider>
  );
}

export default App;
