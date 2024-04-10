export default class DungeonsOfEternityCatalog {
  constructor(indexes) {
    this.groupNames = new Set([...indexes.byGroup.keys()]);
    this.categoryNames = new Set([...indexes.byCategory.keys()]);
    this.gearNames = new Set([...indexes.byName.keys()]);
    this.iconNames = new Set([...indexes.byIcon.keys()]);
    this.rarities = new Set([...indexes.byRarity.keys()]);
    this.damageTypes = new Set([...indexes.byDamageType.keys()]);
    this.perks = new Set([...indexes.byPerk.keys()]);
  }
}
