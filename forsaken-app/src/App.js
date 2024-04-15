import { PrimeReactProvider } from "primereact/api";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Navigation from "./Navigation";
import Welcome from "./Welcome";
import { MeanderingRoutes } from "./Routings";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

export default function App() {
  return (
    <PrimeReactProvider>
      <Container fluid>
        <Navigation />
        <Container>
          <Router>
            <Routes>
              <Route path="/" element={<Welcome />} />
              {MeanderingRoutes}
            </Routes>
          </Router>
        </Container>
      </Container>
    </PrimeReactProvider>
  );
}
