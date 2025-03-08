import { DungeonsOfEternityCache } from "@/models/DungeonsOfEternityCache";
import Renderer from "./renderer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Dungeons Of Externity Combat Simulator",
  description:
    "Dungeons Of Eternity combat simulator for a given weapon with specific perks, " +
    "exo suit perks, against a specific enemy.",
};

export default async function SimulatorPage() {
  const reports = await DungeonsOfEternityCache.FetchReports();
  return <Renderer reports={reports} />;
}
