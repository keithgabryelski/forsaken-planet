import type DungeonsOfEternityIndexes from "./DungeonsOfEternityIndexes";

export default class DungeonsOfEternityCatalog {
  groupNames: Set<string>;
  categoryNames: Set<string>;
  gearNames: Set<string>;
  iconNames: Set<string>;
  rarities: Set<string>;
  damageTypes: Set<string>;
  perks: Set<string>;

  constructor(indexes: DungeonsOfEternityIndexes) {
    this.groupNames = new Set([...indexes.byGroup.keys()]);
    this.categoryNames = new Set([...indexes.byCategory.keys()]);
    this.gearNames = new Set([...indexes.byName.keys()]);
    this.iconNames = new Set([...indexes.byIcon.keys()]);
    this.rarities = new Set([...indexes.byRarity.keys()]);
    this.damageTypes = new Set([...indexes.byDamageType.keys()]);
    this.perks = new Set([...indexes.byPerk.keys()]);
  }
}
