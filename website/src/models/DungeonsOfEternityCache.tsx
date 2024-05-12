import PublicGoogleSheetsParser from "public-google-sheets-parser";
import DungeonsOfEternityIndexes from "./DungeonsOfEternityIndexes";
import DungeonsOfEternityCatalog from "./DungeonsOfEternityCatalog";
import DungeonsOfEternityStatistics from "./DungeonsOfEternityStatistics";

export type DOEReport = {
  rowID: number;
  Name: string;
  Group: string;
  Rarity: string;
  Damage: number;
  Cost: number;
  DamageType: string;
  perks: string;
};

export default class DungeonsOfEternityCache {
  drops: DOEReport[];
  indexes: DungeonsOfEternityIndexes;
  catalog: DungeonsOfEternityCatalog;
  statistics: DungeonsOfEternityStatistics;

  static DungeonsOfEternityCacheSingleton: DungeonsOfEternityCache = null;

  constructor(drops: DOEReport[] = []) {
    DungeonsOfEternityCache.DungeonsOfEternityCacheSingleton = this;
    this.drops = drops;
    this.indexes = new DungeonsOfEternityIndexes(this.drops);
    this.catalog = new DungeonsOfEternityCatalog(this.indexes);
    this.statistics = new DungeonsOfEternityStatistics(
      this.drops,
      this.indexes,
    );
  }

  static async Factory(): Promise<DungeonsOfEternityCache> {
    const json = await this.FetchReports();
    return new DungeonsOfEternityCache(json);
  }

  static async FetchReports(): Promise<DOEReport[]> {
    try {
      // lvl 50
      // const spreadsheetId = '15XGevBozTrsKYo2EGDgq5onnf2fHgTcJfXuA5vTeSnY'
      // lvl 60
      const spreadsheetId = "1x9NlXY6hP0rW3-0F6-AJnJfk6phA4IGze5WE72grH9w";
      const parser = new PublicGoogleSheetsParser(spreadsheetId, {
        sheetName: "All Reports",
        useFormat: false,
      });
      const data = await parser.parse();
      return data.filter(
        (datum) =>
          Boolean(datum.Rarity) &&
          Boolean(datum.Name) &&
          Boolean(datum.Cost) &&
          Boolean(datum.Group) &&
          datum.Group !== "#N/A",
      );
    } catch (e) {
      console.error("fetch failed", e);
      return [];
    }
  }
}
