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
  Element: string;
  perks: string;
  Human: string;
  HumanName: string;
  doesDamage: boolean;
  reload: number;
  Category: string;
  Perk1: string;
  Perk2: string;
};

export class DungeonsOfEternityCache {
  drops: DOEReport[];
  indexes: DungeonsOfEternityIndexes;
  catalog: DungeonsOfEternityCatalog;
  statistics: DungeonsOfEternityStatistics;

  static DungeonsOfEternityCacheSingleton: DungeonsOfEternityCache =
    new DungeonsOfEternityCache();

  constructor(drops: DOEReport[] = []) {
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
    const cache = new DungeonsOfEternityCache(json);
    DungeonsOfEternityCache.DungeonsOfEternityCacheSingleton = cache;
    return cache;
  }

  static async FetchReports(): Promise<DOEReport[]> {
    try {
      // lvl 50
      // const spreadsheetId = '15XGevBozTrsKYo2EGDgq5onnf2fHgTcJfXuA5vTeSnY'

      // lvl 60 + spears
      const spreadsheetId60Spears =
        "1jm1ADn_4syrVwkKI_aWd3xJoVkQAw6n3Ej6SM9J-gJw";
      const parser60Spears = new PublicGoogleSheetsParser(
        spreadsheetId60Spears,
        {
          sheetName: "All Reports",
          useFormat: false,
        },
      );
      const data60Spears = await parser60Spears.parse();
      const reports60Spears = data60Spears.filter(
        (datum) =>
          Boolean(datum.Rarity) &&
          Boolean(datum.Name) &&
          Boolean(datum.Cost) &&
          Boolean(datum.Group) &&
          datum.Group !== "#N/A",
      );

      return reports60Spears;
    } catch (e) {
      console.error("fetch failed", e);
      return [];
    }
  }
}

export class DungeonsOfEternityCacheExtended extends DungeonsOfEternityCache {
  static async Factory(): Promise<DungeonsOfEternityCache> {
    const json = await this.FetchReports();
    const cache = new DungeonsOfEternityCacheExtended(json);
    DungeonsOfEternityCache.DungeonsOfEternityCacheSingleton = cache;
    return cache;
  }

  static async FetchReports(): Promise<DOEReport[]> {
    try {
      // lvl 50
      // const spreadsheetId = '15XGevBozTrsKYo2EGDgq5onnf2fHgTcJfXuA5vTeSnY'

      // lvl 60
      const spreadsheetId60 = "1x9NlXY6hP0rW3-0F6-AJnJfk6phA4IGze5WE72grH9w";
      const parser60 = new PublicGoogleSheetsParser(spreadsheetId60, {
        sheetName: "All Reports",
        useFormat: false,
      });
      const data60 = await parser60.parse();
      const reports60 = data60
        .filter(
          (datum) =>
            Boolean(datum.Rarity) &&
            Boolean(datum.Name) &&
            Boolean(datum.Cost) &&
            Boolean(datum.Group) &&
            datum.Group !== "#N/A",
        )
        .map((r) => {
          if (r.Group === "two-handed") {
            r.Group = "longswords";
            r.Category = "longswords";
          }
          return r;
        });

      // lvl 60 + spears
      const spreadsheetId60Spears =
        "1jm1ADn_4syrVwkKI_aWd3xJoVkQAw6n3Ej6SM9J-gJw";
      const parser60Spears = new PublicGoogleSheetsParser(
        spreadsheetId60Spears,
        {
          sheetName: "All Reports",
          useFormat: false,
        },
      );
      const data60Spears = await parser60Spears.parse();
      const reports60Spears = data60Spears.filter(
        (datum) =>
          Boolean(datum.Rarity) &&
          Boolean(datum.Name) &&
          Boolean(datum.Cost) &&
          Boolean(datum.Group) &&
          datum.Group !== "#N/A",
      );

      return [...reports60, ...reports60Spears];
    } catch (e) {
      console.error("fetch failed", e);
      return [];
    }
  }
}
