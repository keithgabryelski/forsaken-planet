import React, { Component } from "react";
import { PrimeReactProvider } from "primereact/api";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Navigation from "./Navigation";
import Welcome from "./Welcome";
import { MeanderingRoutes } from "./Routings";
import Parser from "rss-parser";
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailedToLoad] = useState(false);
  const [newsfeed, setNewsFeed] = useState(null);

  useEffect(() => {
    const fetcher = async () => {
      const parser = new Parser();
      const url = new URL("https://forsaken-planet.wordpress.com");
      url.pathname = "/feed";
      try {
        const feed = await parser.parseURL(url);
        setNewsfeed(feed);
        setLoading(false);
      } catch (e) {
        setFailedToLoad(true);
      }
    };
    fetcher();
  });

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
          <h1>Forsaken News</h1>
          <Newsfeed feed={newsfeed} />
        </Container>
      </Container>
    </PrimeReactProvider>
  );
}
