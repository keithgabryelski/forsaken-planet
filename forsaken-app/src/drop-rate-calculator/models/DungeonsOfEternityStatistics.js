export default class DungeonsOfEternityStatistics {
  static gearDamageTypesMaxtrix = {
    axes: ["ice", "fire", "poison", "physical"],
    bows: ["ice", "fire", "poison", "physical"],
    crossbows: ["ice", "fire", "poison", "physical"],
    daggers: ["ice", "fire", "poison", "physical"],
    hammers: ["ice", "fire", "poison", "physical"],
    shields: [],
    staves: [],
    swords: ["ice", "fire", "poison", "physical"],
  };
  static weaponPerks = [
    "attack power",
    "criticals",
    "undead damage",
    "monster damage",
    "critter damage",
    "sorcerer damage",
    "elemental damage",
    "elite damage",
  ];
  static axePerks = ["throw distance", "throw damage", "explosions"];
  static bowPerks = ["shot distance", "slowing"];
  static crossbowPerks = ["slowing", "reload"];
  static daggerPerks = ["throw distance", "vampire", "poison"];
  static hammerPerks = ["throw distance", "slowing", "area damage"];
  static shieldPerks = ["knockback distance", "absorb"];
  static swordPerks = ["vampire", "throwable", "stab damage"];

  static gearPerksMatrix = {
    axes: [...this.axePerks, ...this.weaponPerks],
    bows: [...this.bowPerks, ...this.weaponPerks],
    crossbows: [...this.crossbowPerks, ...this.weaponPerks],
    daggers: [...this.daggerPerks, ...this.weaponPerks],
    hammers: [...this.hammerPerks, ...this.weaponPerks],
    shields: [...this.shieldPerks, ...this.weaponPerks],
    staves: [],
    swords: [...this.swordPerks, ...this.weaponPerks],
  };
  static perkSet = new Set([
    ...this.weaponPerks,
    ...this.axePerks,
    ...this.bowPerks,
    ...this.crossbowPerks,
    ...this.daggerPerks,
    ...this.hammerPerks,
    ...this.shieldPerks,
    ...this.swordPerks,
  ]);
  static gearSlotPlacement = {
    axes: "hip",
    bows: "back",
    crossbows: "back",
    daggers: "hip",
    hammers: "hip",
    shields: "back",
    staves: "back",
    swords: "hip",
  };

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
      numDamageTypeDrops: 0,
      numDamageDrops: 0,
      slots: {
        hip: 0,
        back: 0,
      },
      rare: {
        numNoPerks: 0,
        numOneishPerks: 0,
        numTwoPerks: 0,
        perkDrops: {
          axes: 0,
          bows: 0,
          crossbows: 0,
          daggers: 0,
          hammers: 0,
          shields: 0,
          staves: 0,
          swords: 0,
        },
        perkCouldDrop: Object.fromEntries(
          [...DungeonsOfEternityStatistics.perkSet].map((p) => [p, 0]),
        ),
        numPerkDrops: 0,
      },
      legendary: {
        numNoPerks: 0,
        numOneishPerks: 0,
        numTwoPerks: 0,
        perkDrops: {
          axes: 0,
          bows: 0,
          crossbows: 0,
          daggers: 0,
          hammers: 0,
          shields: 0,
          staves: 0,
          swords: 0,
        },
        perkCouldDrop: Object.fromEntries(
          [...DungeonsOfEternityStatistics.perkSet].map((p) => [p, 0]),
        ),
        numPerkDrops: 0,
      },
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

      let rarityStats = {};
      if (item.Rarity === "rare") {
        rarityStats = collections.stats.rare;
      } else {
        rarityStats = collections.stats.legendary;
      }

      for (const perk of DungeonsOfEternityStatistics.gearPerksMatrix[
        item.Group
      ]) {
        rarityStats.perkCouldDrop[perk] += 1;
      }

      const updatePerkDrops = (perk) => {
        if (item.Group === "staves") {
          return;
        }
        if (
          DungeonsOfEternityStatistics.gearPerksMatrix[item.Group].includes(
            perk,
          )
        ) {
          rarityStats.perkDrops[item.Group] += 1;
          rarityStats.numPerkDrops += 1;
        }
      };

      if (item.Perk1) {
        collections.indexes.byPerk.set(
          item.Perk1,
          (collections.indexes.byPerk.get(item.Perk1) ?? []).concat(item),
        );
        updatePerkDrops(item.Perk1);
        if (item.Group !== "staves") {
          rarityStats.numOneishPerks += 1;
        }
      } else {
        if (item.Group !== "staves") {
          rarityStats.numNoPerks += 1;
        }
      }

      if (item.Perk2) {
        collections.indexes.byPerk.set(
          item.Perk2,
          (collections.indexes.byPerk.get(item.Perk2) ?? []).concat(item),
        );
        updatePerkDrops(item.Perk2);
        if (item.Group !== "staves") {
          rarityStats.numTwoPerks += 1;
        }
      }

      const hasDamageType = Object.entries(
        DungeonsOfEternityStatistics.gearDamageTypesMaxtrix,
      ).filter(
        ([key, values]) =>
          item.Group === key && values.includes(item.damageType),
      );
      if (hasDamageType) {
        collections.stats.numDamageTypeDrops += 1;
      }

      collections.stats.slots[
        DungeonsOfEternityStatistics.gearSlotPlacement[item.Group]
      ] += 1;

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
        this.indexes.byDamageType.get(name).length /
          this.stats.numDamageTypeDrops,
      ]),
    );
    this.stats.byPerk = new Map(
      [...this.indexes.byPerk.entries()].map(([name, drops]) => [
        name,
        this.indexes.byPerk.get(name).length /
          (this.stats.rare.perkCouldDrop[name] +
            this.stats.legendary.perkCouldDrop[name]),
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
