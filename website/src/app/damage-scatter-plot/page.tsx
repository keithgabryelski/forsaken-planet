import { DungeonsOfEternityCacheExtended } from "@/models/DungeonsOfEternityCache";
import Renderer from "./renderer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Dungeons Of Externity Weapon Damage Scatter Plot by Group ",
  description:
    "Dungeons Of Eternity scatter plot represeting groups of weapons and their damage.",
};

export default async function Page() {
  const reports = await DungeonsOfEternityCacheExtended.FetchReports();
  return <Renderer reports={reports} />;
}
