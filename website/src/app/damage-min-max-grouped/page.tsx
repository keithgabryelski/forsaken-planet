import { DungeonsOfEternityCacheExtended } from "@/models/DungeonsOfEternityCache";
import Renderer from "./renderer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Dungeons Of Eternity Damage MIN/MAX Bar Chart grouped",
  description:
    "Dungeons Of Eternity min/max ranges for all weapons grouped by rarity.",
};

export default async function Page() {
  const reports = await DungeonsOfEternityCacheExtended.FetchReports();
  return <Renderer reports={reports} />;
}
