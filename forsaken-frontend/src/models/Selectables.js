import { GearItem, RarityItem, DamageTypeItem, PerkItem } from "./Item";

class Selectables {
  constructor(cache, selected) {
    this.cache = cache;
    this.selected = selected;
  }

  get statistics() {
    return this.cache.statistics;
  }

  gear() {
    try {
      return [...this.cache.catalog.groupNames].map(
        (g) => new GearItem(g, this),
      );
    } catch (e) {}
    return [];
  }

  rarities() {
    try {
      return [...this.cache.catalog.rarities].map(
        (g) => new RarityItem(g, this),
      );
    } catch (e) {}
    return [];
  }

  damageTypes() {
    try {
      return [...this.cache.catalog.damageTypes].map(
        (g) => new DamageTypeItem(g, this),
      );
    } catch (e) {}
    return [];
  }

  perks() {
    try {
      return [...this.cache.catalog.perks].map((g) => new PerkItem(g, this));
    } catch (e) {}
    return [];
  }

  selectedGear() {
    try {
      return this.gear().filter((g) => g.isTarget);
    } catch (e) {}
    return [];
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
      (accumulator, item) => accumulator * item.dropRate(),
      1.0,
    );
  }
}

export default Selectables;
