import { DungeonsOfEternityCacheExtended } from "@/models/DungeonsOfEternityCache";
import Renderer from "./renderer";

export const dynamic = "force-dynamic";

export default async function PerkDropRateRadar() {
  const reports = await DungeonsOfEternityCacheExtended.FetchReports();
  return <Renderer reports={reports} />;
}
