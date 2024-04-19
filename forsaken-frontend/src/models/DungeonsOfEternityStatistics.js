import {
  perkSet,
  gearPerksMatrix,
  gearDamageTypesMaxtrix,
  gearSlotPlacement,
} from "./DungeonsOfEternityPerkMatrices";

export default class DungeonsOfEternityStatistics {
  constructor(drops = [], indexes = null) {
    this.totalDrops = 0;
    this.numDamageTypeDrops = 0;
    this.numDamageDrops = 0;
    this.slots = {
      hip: 0,
      back: 0,
    };
    // the number of times this perk has a chance to drop for a given weapon
    // X = total times "a perk" drops for "a weapon"
    // Y = number of times weapons drop
    this.perksDropsByWeapon = Object.fromEntries(
      Object.entries(gearPerksMatrix).map(([g, perks]) => {
        return [
          g,
          Object.fromEntries(
            perks.map((p) => {
              const gearDrops = indexes.byGroup.get(g) || [];
              return [
                p,
                gearDrops.filter((d) => d.Perk1 === p || d.Perk2 === p).length /
                  gearDrops.length,
              ];
            }),
          ),
        ];
      }),
    );
    this.rare = {
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
      perkCouldDrop: Object.fromEntries([...perkSet].map((p) => [p, 0])),
      numPerkDrops: 0,
    };
    this.legendary = {
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
      perkCouldDrop: Object.fromEntries([...perkSet].map((p) => [p, 0])),
      numPerkDrops: 0,
    };
    this.totalDrops = drops.length;

    if (this.totalDrops === 0) {
      // nothing to do
      return;
    }

    for (const item of drops) {
      const rarityStats = item.Rarity === "rare" ? this.rare : this.legendary;

      for (const perk of gearPerksMatrix[item.Group]) {
        rarityStats.perkCouldDrop[perk] += 1;
      }

      const updatePerkDrops = (perk) => {
        if (gearPerksMatrix[item.Group].includes(perk)) {
          rarityStats.perkDrops[item.Group] += 1;
          rarityStats.numPerkDrops += 1;
        }
      };

      if (item.Group !== "staves") {
        if (item.Perk1) {
          updatePerkDrops(item.Perk1);
          rarityStats.numOneishPerks += 1;
        } else {
          rarityStats.numNoPerks += 1;
        }
        if (item.Perk2) {
          updatePerkDrops(item.Perk2);
          rarityStats.numTwoPerks += 1;
        }
      }

      const hasDamageType = Object.entries(gearDamageTypesMaxtrix).filter(
        ([key, values]) =>
          item.Group === key && values.includes(item.damageType),
      );
      if (hasDamageType) {
        this.numDamageTypeDrops += 1;
      }

      this.slots[gearSlotPlacement[item.Group]] += 1;
    }

    this.byName = new Map(
      [...indexes.byName.entries()].map(([name, drops]) => {
        return [name, drops.length / this.totalDrops];
      }),
    );
    this.byCategory = new Map(
      [...indexes.byCategory.entries()].map(([name, drops]) => {
        return [name, drops.length / this.totalDrops];
      }),
    );
    this.byGroup = new Map(
      [...indexes.byGroup.entries()].map(([name, drops]) => {
        return [name, drops.length / this.totalDrops];
      }),
    );
    this.byIcon = new Map(
      [...indexes.byIcon.entries()].map(([name, drops]) => [
        name,
        drops.length / this.totalDrops,
      ]),
    );
    this.byRarity = new Map(
      [...indexes.byRarity.entries()].map(([name, drops]) => [
        name,
        drops.length / this.totalDrops,
      ]),
    );
    this.byDamageType = new Map(
      [...indexes.byDamageType.entries()].map(([name, drops]) => [
        name,
        drops.length / this.numDamageTypeDrops,
      ]),
    );
    this.byPerk = new Map(
      [...indexes.byPerk.entries()].map(([name, drops]) => [
        name,
        drops.length /
          (this.rare.perkCouldDrop[name] + this.legendary.perkCouldDrop[name]),
      ]),
    );
    this.byCost = new Map(
      [...indexes.byCost.entries()].map(([name, drops]) => [
        name,
        drops.length / this.totalDrops,
      ]),
    );
    this.byDamage = new Map(
      [...indexes.byDamage.entries()].map(([name, drops]) => [
        name,
        drops.length / this.totalDrops,
      ]),
    );
  }
}
