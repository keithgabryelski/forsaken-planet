import { useState, useEffect } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import update from "immutability-helper";
import GearNameSelector from "./GearNameSelector";
import DamageTypesSelector from "./DamageTypesSelector";
import DamageSelector from "./DamageSelector";
import PerksSelector from "../drop-rate-calculator/PerksSelector";
import DungeonsOfEternityCache from "../models/DungeonsOfEternityCache";
import Selectables from "../models/Selectables";
import { Item } from "../models/Item";

export default function Simulator() {
  const [cache, setCache] = useState(new DungeonsOfEternityCache());
  const [loading, setLoading] = useState(true);
  const [failedToLoad, setFailedToLoad] = useState(false);
  const [active, setActive] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const [selected, setSelected] = useState({
    gearNames: [],
    rarities: [],
    damageTypes: [],
    perks: [],
    damageMin: null,
    damageMax: null,
    damage: 50,
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
    setDisabled(selected.gearNames.length === 0);
  }, [cache, selected]);

  if (failedToLoad) {
    return <p>bummer</p>;
  }

  if (loading) {
    return null;
  }
  const onClick = () => {
    setActive(true);
    const baseDamage = 75;
    const simulator = new Simulator();
    const scenario = simulator.createScenario(baseDamage);
    const runs = simulator.simulate(scenario);
    return runs;
  };

  return (
    <Container>
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
          <DamageSelector
            damage={selected.damage}
            onChange={(value) => {
              const newSelected = update(selected, {
                damage: { $set: value },
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
              return true;
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
        <Button onClick={onClick} active={active} disabled={disabled}>
          Simulate
        </Button>
      </Row>
    </Container>
  );
}
