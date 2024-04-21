import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import Renderer from "./renderer";

export default async function DropRateCalculator() {
  const reports = await DungeonsOfEternityCache.FetchReports();
  return <Renderer reports={reports} />;
}
