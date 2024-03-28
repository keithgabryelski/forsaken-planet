import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import splash from "./assets/images/forsaken-planet-mint.png";
import ChartGallery from "./ChartGallery";
import Navigation from "./Navigation";

import "./App.css";

function App() {
  return (
    <div>
      <Navigation />

      <Container>
        <Row>
          <Col xs={3}>
            <Image src={splash} alt="forsaken planet" width={210} />
          </Col>
          <Col xs={9}>
            <p>Welcome to Forsaken Planet!</p>
            <p>Fan dedicated resources for Dungeons Of Eternity.</p>
            <p>
              Join the{" "}
              <a href="https://discord.gg/Wwc22C2KCS">
                official Discord channel
              </a>{" "}
              for Dungeons Of Eternity
            </p>
          </Col>
        </Row>
        <Row>
          <Col xs={3} />
          <Col xs={6}>
            <ChartGallery />
          </Col>
          <Col xs={3} />
        </Row>
      </Container>
    </div>
  );
}

export default App;
