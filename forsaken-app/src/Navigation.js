import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

function Navigation() {
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">Forsaken Planet</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <Nav.Link href="/mediawiki">Wiki</Nav.Link>
            <NavDropdown title="Reading List" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="http://bit.ly/dungeons-of-eternity-statistics">
                Drop Rate Spreadsheets
              </NavDropdown.Item>
              <NavDropdown.Item href="https://bit.ly/doe-gear-drop-calculator">
                Gear Drop Calculator
              </NavDropdown.Item>
              <NavDropdown.Item href="https://github.com/keithgabryelski/dungeons-of-eternity-statistics">
                Statistics GitHub Repository (R Code)
              </NavDropdown.Item>
              <NavDropdown.Item href="https://github.com/keithgabryelski/forsaken-planet">
                This Site's GitHub Repository
              </NavDropdown.Item>
              <NavDropdown.Item href="https://discord.gg/Wwc22C2KCS">
                Discord
              </NavDropdown.Item>
              <NavDropdown.Item href="https://www.meta.com/referrals/link/Protagosus">
                Meta Referral Program (it helps!)
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="Tools" id="tools-nav-dropdown">
              <NavDropdown.Item href="#/drop-rate-calculator">
                Drop Rate Calculator
              </NavDropdown.Item>
              <NavDropdown.Item href="#/gallery">
                Protagosus' Statistical Guides and Magical Meandering
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
