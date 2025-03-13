import { DungeonsOfEternityCacheExtended } from "@/models/DungeonsOfEternityCache";
import Renderer from "./renderer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Dungeons Of Eternity Weapon Element Pie Chart",
  description: "Dungeons Of Eternity Weapon drop statistics by element type.",
};

export default async function Page() {
  const reports = await DungeonsOfEternityCacheExtended.FetchReports();
  return <Renderer reports={reports} />;
}
