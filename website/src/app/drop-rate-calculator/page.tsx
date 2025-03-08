import { DungeonsOfEternityCache } from "@/models/DungeonsOfEternityCache";
import Renderer from "./renderer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Dungeons Of Externity Drop Rate Calculator",
  description:
    "Dungeons Of Eternity calculate drop rate of a given weapon with specific perks.",
};

export default async function DropRateCalculator() {
  const reports = await DungeonsOfEternityCache.FetchReports();
  return <Renderer reports={reports} />;
}
