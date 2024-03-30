import { Col, Container, Image, Row } from "react-bootstrap";
import splash from "./assets/images/forsaken-planet-mint.png";

function Welcome() {
  return (
    <Container>
      <Row>
        <Col md={3}>
          <Image src={splash} alt="forsaken planet" width={210} />
        </Col>
        <Col md={1}></Col>
        <Col md={6}>
          <p>Welcome to Forsaken Planet!</p>
          <p>Fan dedicated resources for Dungeons Of Eternity.</p>
          <p>
            Join the{" "}
            <a href="https://discord.gg/Wwc22C2KCS">official Discord channel</a>{" "}
            for Dungeons Of Eternity
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Welcome;
