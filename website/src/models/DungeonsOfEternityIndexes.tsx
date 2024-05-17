import { type DOEReport } from "./DungeonsOfEternityCache";

export default class DungeonsOfEternityIndexes {
  byHumanName: Map<string, DOEReport>;
  byHuman: Map<string, DOEReport>;
  byGroup: Map<string, DOEReport>;
  byCategory: Map<string, DOEReport>;
  byName: Map<string, DOEReport>;
  byIcon: Map<string, DOEReport>;
  byRarity: Map<string, DOEReport>;
  byElement: Map<string, DOEReport>;
  byPerk: Map<string, DOEReport>;
  byCost: Map<string, DOEReport>;
  byDamage: Map<string, DOEReport>;

  constructor(drops: DOEReport[] = []) {
    this.byHumanName = new Map();
    this.byHuman = new Map();
    this.byGroup = new Map();
    this.byCategory = new Map();
    this.byName = new Map();
    this.byIcon = new Map();
    this.byRarity = new Map();
    this.byElement = new Map();
    this.byPerk = new Map();
    this.byCost = new Map();
    this.byDamage = new Map();

    for (const item of drops) {
      if (!item.Element) {
        item.Element = "physical";
      }

      item.doesDamage = !(
        item.Group === "shields" ||
        ["ice staff", "healing staff"].includes(item.Name)
      );

      if (item.reload) {
        item.Human = `${item.Group}+reload`;
        item.HumanName = `${item.Name}+reload`;
      } else {
        item.Human = item.Group;
        item.HumanName = item.Name;
      }

      this.byGroup.set(
        item.Group,
        (this.byGroup.get(item.Group) ?? []).concat(item),
      );

      this.byHuman.set(
        item.Human,
        (this.byHuman.get(item.Human) ?? []).concat(item),
      );
      this.byHumanName.set(
        item.HumanName,
        (this.byHumanName.get(item.HumanName) ?? []).concat(item),
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
      this.byElement.set(
        item.Element,
        (this.byElement.get(item.Element) ?? []).concat(item),
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
