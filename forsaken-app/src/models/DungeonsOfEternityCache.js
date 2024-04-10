import DungeonsOfEternityIndexes from "./DungeonsOfEternityIndexes";
import DungeonsOfEternityCatalog from "./DungeonsOfEternityCatalog";
import DungeonsOfEternityStatistics from "./DungeonsOfEternityStatistics";
export * from "./DungeonsOfEternityPerkMatrices";

export default class DungeonsOfEternityCache {
  constructor(drops = []) {
    this.indexes = new DungeonsOfEternityIndexes(drops);
    this.catalog = new DungeonsOfEternityCatalog(this.indexes);
    this.statistics = new DungeonsOfEternityStatistics(drops, this.indexes);
  }
}
