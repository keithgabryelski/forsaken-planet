import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import Renderer from "./renderer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Drop Rate Calculator",
  description:
    "Forsaken Planet: Dungeons Of Eternity calculate drop rate of a given weapon with specific perks.",
};

export default async function DropRateCalculator() {
  const reports = await DungeonsOfEternityCache.FetchReports();
  return <Renderer reports={reports} />;
}
