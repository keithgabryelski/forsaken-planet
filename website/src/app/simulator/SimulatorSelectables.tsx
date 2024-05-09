import type DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import type DungeonsOfEternityStatistics from "@/models/DungeonsOfEternityStatistics";
import { exoDescriptions } from "@/models/EXOs";

export type Selectables = {
  gearName: { name: string; code: string };
  damage: number;
  elementName: { name: string; code: string };
  perk1Name: { name: string; code: string };
  perk2Name: { name: string; code: string };
  armEXOName: { name: string; code: string };
  attackStyle: { name: string; code: string };
  opponentIdentities: string[];
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

  get elementNames() {
    return [...this.cache.catalog.elements];
  }
  get elementNamesAsOptions() {
    return this.elementNames.map((o) => ({ name: o, code: o }));
  }

  get perkNames() {
    return [...this.cache.catalog.perks];
  }
  get perkNamesAsOptions() {
    return this.perkNames.map((o) => ({ name: o, code: o }));
  }
}
