import DungeonsOfEternityIndexes from "./DungeonsOfEternityIndexes";
import DungeonsOfEternityCatalog from "./DungeonsOfEternityCatalog";
import DungeonsOfEternityStatistics from "./DungeonsOfEternityStatistics";
import { Filesystem, LocalStorageDevice } from "./Filesystem";

export * from "./DungeonsOfEternityPerkMatrices";

const STALE_TIME = 60 * 60 * 1000; // one hour

export default class DungeonsOfEternityCache {
  constructor(drops = []) {
    this.drops = drops;
    this.indexes = new DungeonsOfEternityIndexes(drops);
    this.catalog = new DungeonsOfEternityCatalog(this.indexes);
    this.statistics = new DungeonsOfEternityStatistics(drops, this.indexes);
  }

  static async Factory() {
    const fs = new Filesystem("forsaken-data", new LocalStorageDevice());
    const fe = fs.folderEntry("forsaken-cache");
    let json = fs.readFile("forsaken-cache");
    if (!fe || Date.now() - fe.updatedAt > STALE_TIME) {
      json = null;
    }
    if (!json) {
      const url = new URL(window.location.origin);
      url.port = 3001;
      url.pathname = "/reports";
      try {
        console.info("fetching json");
        const fetched = await fetch(url, {
          method: "GET",
        });
        json = await fetched.json();
        fs.writeFile("forsaken-cache", json);
      } catch (e) {
        return null;
      }
    }

    return new DungeonsOfEternityCache(json);
  }
}
