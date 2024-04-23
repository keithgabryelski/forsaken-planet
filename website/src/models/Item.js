import {
  gearPerksMatrix,
  gearDamageTypesMaxtrix,
} from "./DungeonsOfEternityPerkMatrices";

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
  get code() {
    return this.name;
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

  static dropRate(selected, statsIndex, logical = "or") {
    if (selected.length === 0) {
      return 1.0;
    }

    let dropRate = 1.0;
    if (logical === "or") {
      dropRate = selected.reduce((accumulator, gearName) => {
        return accumulator + statsIndex.get(gearName);
      }, 0.0);
    } else {
      dropRate = selected.reduce((accumulator, gearName) => {
        return accumulator * statsIndex.get(gearName);
      }, 1.0);
    }
    return dropRate;
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
      humanText = `about one in ${inTotal} drops`;
    } else {
      humanText = "almost never";
    }

    return { percent, humanText };
  }

  static isTargetable(targets) {
    return targets.every((target) => target.isTargetable);
  }

  static footerTemplateFunc(length, percent, humanText) {
    return function template() {
      const num = length === 0 ? "no" : length;
      const items = "item" + (length !== 1 ? "s" : "");
      return (
        <div className="w-12rem border-round m-2 white-space-nowrap">
          <b>{num}</b> {items} selected: {percent}% ({humanText})
        </div>
      );
    };
  }

  static itemTemplate(item) {
    const { percent, humanText } = item.dropRatePercent();

    if (item.isTarget) {
      return (
        <div className="border-round m-2 white-space-nowrap">
          {item.name} {percent}% ({humanText})
        </div>
      );
    }
    if (item.isTargetable) {
      return (
        <div className="border-round m-2 white-space-nowrap">
          {item.name} {percent}% ({humanText})
        </div>
      );
    }
    return (
      <div className="border-round m-2 white-space-nowrap">
        <strike>{item.name}</strike> {percent}% ({humanText})
      </div>
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
    return Item.dropRate([this.name], this.statistics.byGroup);
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
    return Item.dropRate([this.name], this.statistics.byRarity);
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
    return Item.dropRate([this.name], this.statistics.byDamageType);
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
    return Item.dropRate([this.name], this.statistics.byPerk, "and");
  }

  static itemTemplate(item) {
    return Item.itemTemplate(item);
  }
}
