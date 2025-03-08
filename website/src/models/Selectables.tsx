import { GearItem, RarityItem, ElementItem, PerkItem } from "./Item";
import { type DungeonsOfEternityCache } from "./DungeonsOfEternityCache";

class Selectables {
  cache: DungeonsOfEternityCache;
  selected: object;

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
    } catch (_e) {
      // nothing
    }
    return [];
  }

  rarities() {
    try {
      return [...this.cache.catalog.rarities].map(
        (g) => new RarityItem(g, this),
      );
    } catch (_e) {
      // nothing
    }
    return [];
  }

  elements() {
    try {
      return [...this.cache.catalog.elements].map(
        (g) => new ElementItem(g, this),
      );
    } catch (_e) {
      // nothing
    }
    return [];
  }

  perks() {
    try {
      return [...this.cache.catalog.perks].map((g) => new PerkItem(g, this));
    } catch (_e) {
      // nothing
    }
    return [];
  }

  selectedGear() {
    try {
      return this.gear().filter((g) => g.isTarget);
    } catch (_e) {
      // nothing
    }
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

  selectedElements() {
    return this.elements().filter((g) => g.isTarget);
  }

  selectedElementsDropRate() {
    return this.selectedElements().reduce(
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
