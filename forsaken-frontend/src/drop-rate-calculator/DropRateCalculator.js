import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import update from "immutability-helper";
import Header from "./Header";
import Footer from "./Footer";
import GearNameSelector from "./GearNameSelector";
import RaritiesSelector from "./RaritiesSelector";
import DamageTypesSelector from "./DamageTypesSelector";
import PerksSelector from "./PerksSelector";
import DropRate from "./DropRate";
import DungeonsOfEternityCache from "../models/DungeonsOfEternityCache";
import Selectables from "../models/Selectables";
import { Item } from "../models/Item";

function DropRateCalculator() {
  const [cache, setCache] = useState(new DungeonsOfEternityCache());
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailedToLoad] = useState(false);

  const [selected, setSelected] = useState({
    gearNames: [],
    rarities: [],
    damageTypes: [],
    perks: [],
    damageMin: null,
    damageMax: null,
  });

  const [selectables, setSelectables] = useState(
    new Selectables(cache, selected),
  );

  useEffect(() => {
    const fetcher = async () => {
      const newCache = await DungeonsOfEternityCache.Factory();
      if (newCache == null) {
        setFailedToLoad(true);
        return;
      }
      setCache(newCache);
      setLoading(false);
    };

    fetcher();
  }, []);

  useEffect(() => {
    setSelectables(new Selectables(cache, selected));
  }, [cache, selected]);

  if (failedToLoad) {
    return <p>bummer</p>;
  }

  if (loading) {
    return null;
  }
  return (
    <Container>
      <Header />
      <Row>
        <Col>
          <GearNameSelector
            selectables={selectables}
            onChange={(targets) => {
              const targetable = Item.isTargetable(targets);
              if (!targetable) {
                console.info("is not gear targetable", targets);
                return;
              }
              const newSelected = update(selected, {
                gearNames: { $set: targets.map((t) => t.name) },
              });
              setSelected(newSelected);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <RaritiesSelector
            selectables={selectables}
            onChange={(targets) => {
              const targetable = Item.isTargetable(targets);
              if (!targetable) {
                console.info("is not rarity targetable", targets);
                return;
              }
              const newSelected = update(selected, {
                rarities: { $set: targets.map((t) => t.name) },
              });
              setSelected(newSelected);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <DamageTypesSelector
            selectables={selectables}
            onChange={(targets) => {
              const targetable = Item.isTargetable(targets);
              if (!targetable) {
                console.info("is not damageType targetable", targets);
                return;
              }
              const newSelected = update(selected, {
                damageTypes: { $set: targets.map((t) => t.name) },
              });
              setSelected(newSelected);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <PerksSelector
            selectables={selectables}
            onChange={(targets) => {
              const targetable = Item.isTargetable(targets);
              if (!targetable) {
                console.info("is not perk targetable", targets);
                return;
              }
              const newSelected = update(selected, {
                perks: { $set: targets.map((t) => t.name) },
              });
              setSelected(newSelected);
            }}
          />
        </Col>
      </Row>
      <Row className="display-3">
        <DropRate selectables={selectables} />
      </Row>
      <Row>
        <Footer selectables={selectables} />
      </Row>
    </Container>
  );
}

export default DropRateCalculator;
