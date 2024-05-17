import type DungeonsOfEternityIndexes from "./DungeonsOfEternityIndexes";

export default class DungeonsOfEternityCatalog {
  humanNames: Set<string>;
  humanGroupNames: Set<string>;
  groupNames: Set<string>;
  categoryNames: Set<string>;
  gearNames: Set<string>;
  rarities: Set<string>;
  elements: Set<string>;
  perks: Set<string>;

  constructor(indexes: DungeonsOfEternityIndexes) {
    this.humanNames = new Set([...indexes.byHumanName.keys()]);
    this.humanGroupNames = new Set([...indexes.byHuman.keys()]);
    this.groupNames = new Set([...indexes.byGroup.keys()]);
    this.categoryNames = new Set([...indexes.byCategory.keys()]);
    this.gearNames = new Set([...indexes.byName.keys()]);
    this.rarities = new Set([...indexes.byRarity.keys()]);
    this.elements = new Set([...indexes.byElement.keys()]);
    this.perks = new Set([...indexes.byPerk.keys()]);
  }
}
