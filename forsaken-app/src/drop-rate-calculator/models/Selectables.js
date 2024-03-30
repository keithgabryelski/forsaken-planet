import { GearItem, RarityItem, DamageTypeItem, PerkItem } from "./Item";

class Selectables {
  constructor(statistics, selected) {
    this.statistics = statistics;
    this.selected = selected;
  }

  gear() {
    return [...this.statistics.catalog.groupNames].map(
      (g) => new GearItem(g, this),
    );
  }

  rarities() {
    return [...this.statistics.catalog.rarities].map(
      (g) => new RarityItem(g, this),
    );
  }

  damageTypes() {
    return [...this.statistics.catalog.damageTypes].map(
      (g) => new DamageTypeItem(g, this),
    );
  }

  perks() {
    return [...this.statistics.catalog.perks].map((g) => new PerkItem(g, this));
  }

  selectedGear() {
    return this.gear().filter((g) => g.isTarget);
  }

  selectedGearDropRate() {
    return this.selectedGear().reduce(
      (accumulator, item) => accumulator + item.dropRate(),
      0.0,
    );
  }

  selectedRarities() {
    return this.rarities().filter((g) => g.isTarget);
  }

  selectedRaritiesDropRate() {
    return this.selectedRarities().reduce(
      (accumulator, item) => accumulator + item.dropRate(),
      0.0,
    );
  }

  selectedDamageTypes() {
    return this.damageTypes().filter((g) => g.isTarget);
  }

  selectedDamageTypesDropRate() {
    return this.selectedDamageTypes().reduce(
      (accumulator, item) => accumulator + item.dropRate(),
      0.0,
    );
  }

  selectedPerks() {
    return this.perks().filter((g) => g.isTarget);
  }

  selectedPerksDropRate() {
    return this.selectedPerks().reduce(
      (accumulator, item) => accumulator + item.dropRate(),
      0.0,
    );
  }
}

export default Selectables;
