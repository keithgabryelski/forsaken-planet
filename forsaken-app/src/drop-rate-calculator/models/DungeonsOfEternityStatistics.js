export default class DungeonsOfEternityStatistics {
  constructor(drops = []) {
    this.drops = drops;
    this.catalog = {
      groupNames: new Set(),
      categoryNames: new Set(),
      gearNames: new Set(),
      iconNames: new Set(),
      rarities: new Set(),
      damageTypes: new Set(),
      perks: new Set(),
    };
    this.indexes = {
      byGroup: new Map(),
      byCategory: new Map(),
      byName: new Map(),
      byIcon: new Map(),
      byRarity: new Map(),
      byDamageType: new Map(),
      byPerk: new Map(),
      byCost: new Map(),
      byDamage: new Map(),
    };
    this.stats = {
      totalDrops: 0,
      byGroup: new Map(),
      byCategory: new Map(),
      byName: new Map(),
      byIcon: new Map(),
      byRarity: new Map(),
      byDamageType: new Map(),
      byPerk: new Map(),
      byCost: new Map(),
      byDamage: new Map(),
    };

    drops.reduce((collections, item) => {
      collections.indexes.byGroup.set(
        item.Group,
        (collections.indexes.byGroup.get(item.Group) ?? []).concat(item),
      );
      collections.indexes.byCategory.set(
        item.Category,
        (collections.indexes.byCategory.get(item.Category) ?? []).concat(item),
      );
      collections.indexes.byName.set(
        item.Name,
        (collections.indexes.byName.get(item.Name) ?? []).concat(item),
      );
      collections.indexes.byIcon.set(
        item.Icon,
        (collections.indexes.byIcon.get(item.Icon) ?? []).concat(item),
      );
      collections.indexes.byRarity.set(
        item.Rarity,
        (collections.indexes.byRarity.get(item.Rarity) ?? []).concat(item),
      );
      collections.indexes.byDamageType.set(
        item.DamageType,
        (collections.indexes.byDamageType.get(item.DamageType) ?? []).concat(
          item,
        ),
      );
      if (item.Cost) {
        collections.indexes.byCost[item.Cost] = (
          collections.indexes.byCost[item.Cost] ?? []
        ).concat(item);
      }
      if (item.Damage) {
        collections.indexes.byDamage[item.Damage] = (
          collections.indexes.byDamage[item.Damage] ?? []
        ).concat(item);
      }
      if (item.Perk1) {
        collections.indexes.byPerk.set(
          item.Perk1,
          (collections.indexes.byPerk.get(item.Perk1) ?? []).concat(item),
        );
      }
      if (item.Perk2) {
        collections.indexes.byPerk.set(
          item.Perk2,
          (collections.indexes.byPerk.get(item.Perk2) ?? []).concat(item),
        );
      }
      return collections;
    }, this);

    this.stats.totalDrops = this.drops.length;
    this.stats.byName = new Map(
      [...this.indexes.byName.entries()].map(([name, drops]) => {
        return [
          name,
          this.indexes.byName.get(name).length / this.stats.totalDrops,
        ];
      }),
    );
    this.stats.byCategory = new Map(
      [...this.indexes.byCategory.entries()].map(([name, drops]) => {
        return [
          name,
          this.indexes.byCategory.get(name).length / this.stats.totalDrops,
        ];
      }),
    );
    this.stats.byGroup = new Map(
      [...this.indexes.byGroup.entries()].map(([name, drops]) => {
        return [
          name,
          this.indexes.byGroup.get(name).length / this.stats.totalDrops,
        ];
      }),
    );
    this.stats.byIcon = new Map(
      [...this.indexes.byIcon.entries()].map(([name, drops]) => [
        name,
        this.indexes.byIcon.get(name).length / this.stats.totalDrops,
      ]),
    );
    this.stats.byRarity = new Map(
      [...this.indexes.byRarity.entries()].map(([name, drops]) => [
        name,
        this.indexes.byRarity.get(name).length / this.stats.totalDrops,
      ]),
    );
    this.stats.byDamageType = new Map(
      [...this.indexes.byDamageType.entries()].map(([name, drops]) => [
        name,
        this.indexes.byDamageType.get(name).length / this.stats.totalDrops,
      ]),
    );
    this.stats.byPerk = new Map(
      [...this.indexes.byPerk.entries()].map(([name, drops]) => [
        name,
        /* XXX totalDropsFor(perks that can be shared with this perk) */
        this.indexes.byPerk.get(name).length / this.stats.totalDrops,
      ]),
    );
    this.stats.byCost = new Map(
      [...this.indexes.byCost.entries()].map(([name, drops]) => [
        name,
        this.indexes.byCost.get(name).length / this.stats.totalDrops,
      ]),
    );
    this.stats.byDamage = new Map(
      [...this.indexes.byDamage.entries()].map(([name, drops]) => [
        name,
        this.indexes.byDamage.get(name).length / this.stats.totalDrops,
      ]),
    );

    this.catalog.groupNames = new Set([...this.indexes.byGroup.keys()]);
    this.catalog.categoryNames = new Set([...this.indexes.byCategory.keys()]);
    this.catalog.gearNames = new Set([...this.indexes.byName.keys()]);
    this.catalog.iconNames = new Set([...this.indexes.byIcon.keys()]);
    this.catalog.rarities = new Set([...this.indexes.byRarity.keys()]);
    this.catalog.damageTypes = new Set([...this.indexes.byDamageType.keys()]);
    this.catalog.perks = new Set([...this.indexes.byPerk.keys()]);
  }
}
