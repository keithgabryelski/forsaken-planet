import DungeonsOfEternityIndexes from "./DungeonsOfEternityIndexes";
import DungeonsOfEternityCatalog from "./DungeonsOfEternityCatalog";
import DungeonsOfEternityStatistics from "./DungeonsOfEternityStatistics";

export * from "./DungeonsOfEternityPerkMatrices";

const STALE_TIME = 60 * 60 * 1000; // one hour

export default class DungeonsOfEternityCache {
  constructor(drops = []) {
    this.drops = drops;
    this.indexes = new DungeonsOfEternityIndexes(this.drops);
    this.catalog = new DungeonsOfEternityCatalog(this.indexes);
    this.statistics = new DungeonsOfEternityStatistics(
      this.drops,
      this.indexes,
    );
  }

  static async Factory() {
    const json = await this.FetchReports();
    return new DungeonsOfEternityCache(json);
  }

  static async FetchReports() {
    const url = new URL("http://localhost");
    url.port = 3001;
    url.pathname = "/reports";
    const fetched = await fetch(url, {
      method: "GET",
      next: { revalidate: 3600 },
    });
    return fetched.json();
  }
}
