import type DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import type DungeonsOfEternityStatistics from "@/models/DungeonsOfEternityStatistics";
import { exoDescriptions } from "@/models/DungeonsOfEternityPerkMatrices";

export type Selectables = {
  gearName: string;
  damage: number;
  damageTypeName: string;
  perk1Name: string;
  perk2Name: string;
  armEXOName: string;
  enemyName: string;
};

export default class SimulatorSelectables {
  cache: DungeonsOfEternityCache;

  constructor(cache: DungeonsOfEternityCache) {
    this.cache = cache;
  }

  get statistics(): DungeonsOfEternityStatistics {
    return this.cache.statistics;
  }

  get exoNames() {
    return [...Object.keys(exoDescriptions)];
  }
  get exoNamesAsOptions() {
    return this.exoNames.map((o) => ({ name: o, code: o }));
  }

  get armEXONames() {
    return [...Object.entries(exoDescriptions)]
      .filter(([_name, details]) => details.placement === "Arms")
      .map(([name, _details]) => name);
  }
  get armEXONamesAsOptions() {
    return this.armEXONames.map((o) => ({ name: o, code: o }));
  }

  get groupNames() {
    return [...this.cache.catalog.groupNames];
  }
  get groupNamesAsOptions() {
    return this.groupNames.map((o) => ({ name: o, code: o }));
  }

  get rarities() {
    return [...this.cache.catalog.rarities];
  }
  get raritiesAsOptions() {
    return this.rarities.map((o) => ({ name: o, code: o }));
  }

  get damageTypeNames() {
    return [...this.cache.catalog.damageTypes];
  }
  get damageTypeNamesAsOptions() {
    return this.damageTypeNames.map((o) => ({ name: o, code: o }));
  }

  get perkNames() {
    return [...this.cache.catalog.perks];
  }
  get perkNamesAsOptions() {
    return this.perkNames.map((o) => ({ name: o, code: o }));
  }
}
