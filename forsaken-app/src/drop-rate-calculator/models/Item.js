import { Row, Col } from "react-bootstrap";
import { gearPerksMatrix, gearDamageTypesMaxtrix } from "./Perks";
import Calculator from "./Calculator";

export class Item {
  constructor(name, selectables) {
    this.name = name;
    this.selectables = selectables;
  }
  get statistics() {
    return this.selectables.statistics;
  }
  get selected() {
    return this.selectables.selected;
  }
  get itemNames() {
    return [];
  }
  get isSource() {
    return !this.isTarget;
  }
  get isTarget() {
    return this.itemNames.some((n) => this.name === n);
  }
  get isTargetable() {
    return true;
  }

  dropRate() {
    return 1.0;
  }

  dropRatePercent() {
    const total = this.dropRate();
    return Item.dropRatePercent(total);
  }

  static dropRatePercent(total) {
    let percent = Math.round(total * 100000) / 1000;
    let humanText = "unknown";
    let factor = 100;
    for (let i = 0; i < 6; ++i) {
      if (total * factor >= 1.0) {
        break;
      }
      factor *= 10;
    }
    const coef = Math.round(total * factor);
    console.info("before factor = ", total, factor, coef, total * factor);
    if (coef > 0) {
      factor *= coef;
    }
    const numerator = Math.round(total * factor);
    const denominator = factor;
    const divisor = Item.gcd(numerator, denominator);
    let num = numerator / divisor;
    let inTotal = denominator / divisor;
    // here we have x in y
    inTotal = Math.round(inTotal / num);
    num = 1;
    // round to 1 in z

    if (num === inTotal) {
      humanText = "always";
    } else if (isFinite(num) && isFinite(inTotal) && inTotal !== 0) {
      humanText = `one in ${inTotal} drops`;
    } else {
      humanText = "almost never";
    }

    return { percent, humanText };
  }

  static isTargetable(targets) {
    return targets.every((target) => target.isTargetable);
  }

  static footerTemplateFunc(length, percent, humanText) {
    return () => {
      return (
        <div className="py-2 px-3">
          <span>
            <b>{length}</b> item{length > 1 ? "s" : ""} selected.
          </span>
          <span>
            {percent}% ({humanText})
          </span>
        </div>
      );
    };
  }

  static itemTemplate(item) {
    const { percent, humanText } = item.dropRatePercent();

    if (item.isTarget) {
      return (
        <Row
          style={{
            lineHeight: "0.75",
          }}
        >
          <Col>{item.name}</Col>
          <Col>
            {percent}% ({humanText})
          </Col>
        </Row>
      );
    }
    if (item.isTargetable) {
      return (
        <Row
          style={{
            lineHeight: "0.75",
          }}
        >
          <Col>{item.name}</Col>
          <Col>
            {percent}% ({humanText})
          </Col>
        </Row>
      );
    }
    return (
      <Row
        style={{
          lineHeight: "0.75",
        }}
      >
        <Col>
          <strike>{item.name}</strike>
        </Col>
        <Col>
          {percent}% ({humanText})
        </Col>
      </Row>
    );
  }

  static gcd(a, b) {
    // Take the absolute values of a and b to ensure positivity.
    let x = Math.abs(a);
    let y = Math.abs(b);

    // Iterate using the Euclidean algorithm to find the GCD.
    while (y) {
      // Store the value of y in a temporary variable t.
      let t = y;
      // Calculate the remainder of x divided by y and assign it to y.
      y = x % y;
      // Assign the value of t (previous value of y) to x.
      x = t;
    }
    // Return the GCD, which is stored in x after the loop.
    return x;
  }
}

export class GearItem extends Item {
  get itemNames() {
    return this.selected.gearNames;
  }
  get isValidGearForDamageType() {
    return this.selected.damageTypes.every((damageType) =>
      gearDamageTypesMaxtrix[this.name]?.includes(damageType),
    );
  }

  get isValidGearForPerk() {
    return this.selected.perks.every((perk) =>
      gearPerksMatrix[this.name]?.includes(perk),
    );
  }

  get isValidGearFor() {
    return this.isValidGearForDamageType && this.isValidGearForPerk;
  }

  get isTargetable() {
    return this.isValidGearFor;
  }

  dropRate() {
    return new Calculator().dropRate(
      [this.name],
      this.statistics.stats.byGroup,
    );
  }

  static itemTemplate(item) {
    return Item.itemTemplate(item);
  }
}

export class RarityItem extends Item {
  get itemNames() {
    return this.selected.rarities;
  }

  get isTargetable() {
    return true;
  }

  dropRate() {
    return new Calculator().dropRate(
      [this.name],
      this.statistics.stats.byRarity,
    );
  }

  static itemTemplate(item) {
    return Item.itemTemplate(item);
  }
}

export class DamageTypeItem extends Item {
  get itemNames() {
    return this.selected.damageTypes;
  }

  get isTargetable() {
    return true; /* XXX */
  }

  dropRate() {
    return new Calculator().dropRate(
      [this.name],
      this.statistics.stats.byDamageType,
    );
  }

  static itemTemplate(item) {
    return Item.itemTemplate(item);
  }
}

export class PerkItem extends Item {
  get itemNames() {
    return this.selected.perks;
  }

  get isValidPerkForGear() {
    return this.selected.gearNames.every((gearName) =>
      gearPerksMatrix[gearName]?.includes(this.name),
    );
  }

  get isTargetable() {
    return this.isValidPerkForGear;
  }

  dropRate() {
    return new Calculator().dropRate([this.name], this.statistics.stats.byPerk);
  }

  static itemTemplate(item) {
    return Item.itemTemplate(item);
  }
}
