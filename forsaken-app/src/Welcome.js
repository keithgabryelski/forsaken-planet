import Button from "react-bootstrap/Button";
import { Container } from "react-bootstrap";
import splash from "./assets/images/forsaken-planet-hero.jpg";

function Welcome() {
  return (
    <Container>
      <div className="grid grid-nogutter surface-0 text-800">
        <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">
          <section>
            <span className="block text-6xl font-bold mb-1">
              Welcome to Forsaken Planet!
            </span>
            <div className="text-6xl text-primary font-bold mb-3">
              Fan dedicated resources for Dungeons Of Eternity.
            </div>
            <p className="mt-0 mb-4 text-700 line-height-3">
              Join the{" "}
              <a href="https://discord.gg/Wwc22C2KCS">
                official Discord channel
              </a>{" "}
              for Dungeons Of Eternity
            </p>

            <Button className="mr-3 p-button-raised" href="/mediawiki">
              Forsaken Wiki
            </Button>
            <Button
              type="button"
              className="mr-3 p-button-raised"
              href="/#/gallery"
            >
              Forsaken Meanderings
            </Button>
            <Button
              type="button"
              className="mr-3 p-button-raised"
              href="/#/tools"
            >
              Forsaken Tools
            </Button>
          </section>
        </div>
        <div className="col-12 md:col-6 overflow-hidden">
          <img
            src={splash}
            alt="hero-1"
            className="md:ml-auto block md:h-full"
            style={{ clipPath: "polygon(8% 0, 100% 0%, 100% 100%, 0 100%)" }}
          />
        </div>
      </div>
    </Container>
  );
}

export default Welcome;
