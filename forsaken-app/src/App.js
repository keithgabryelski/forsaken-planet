import { PrimeReactProvider } from "primereact/api";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import ChartGallery from "./ChartGallery";
import Navigation from "./Navigation";
import Welcome from "./Welcome";
import DropRateCalculator from "./drop-rate-calculator/DropRateCalculator";
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
              <Route path="/gallery" element={<ChartGallery />} />
              <Route
                path="/drop-rate-calculator"
                element={<DropRateCalculator />}
              />
            </Routes>
          </Router>
        </Container>
      </Container>
    </PrimeReactProvider>
  );
}

export default App;
