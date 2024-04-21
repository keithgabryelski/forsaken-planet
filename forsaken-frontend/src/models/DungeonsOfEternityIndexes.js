export default class DungeonsOfEternityIndexes {
  constructor(drops = []) {
    this.byGroup = new Map();
    this.byCategory = new Map();
    this.byName = new Map();
    this.byIcon = new Map();
    this.byRarity = new Map();
    this.byDamageType = new Map();
    this.byPerk = new Map();
    this.byCost = new Map();
    this.byDamage = new Map();

    for (const item of drops) {
      this.byGroup.set(
        item.Group,
        (this.byGroup.get(item.Group) ?? []).concat(item),
      );
      this.byCategory.set(
        item.Category,
        (this.byCategory.get(item.Category) ?? []).concat(item),
      );
      this.byName.set(
        item.Name,
        (this.byName.get(item.Name) ?? []).concat(item),
      );
      this.byIcon.set(
        item.Icon,
        (this.byIcon.get(item.Icon) ?? []).concat(item),
      );
      this.byRarity.set(
        item.Rarity,
        (this.byRarity.get(item.Rarity) ?? []).concat(item),
      );
      this.byDamageType.set(
        item.DamageType,
        (this.byDamageType.get(item.DamageType) ?? []).concat(item),
      );
      if (item.Cost) {
        this.byCost[item.Cost] = (this.byCost[item.Cost] ?? []).concat(item);
      }
      if (item.Damage) {
        this.byDamage[item.Damage] = (this.byDamage[item.Damage] ?? []).concat(
          item,
        );
      }

      if (item.Perk1) {
        this.byPerk.set(
          item.Perk1,
          (this.byPerk.get(item.Perk1) ?? []).concat(item),
        );
      }

      if (item.Perk2) {
        this.byPerk.set(
          item.Perk2,
          (this.byPerk.get(item.Perk2) ?? []).concat(item),
        );
      }
    }
  }
}