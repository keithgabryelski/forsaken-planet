import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import Renderer from "./renderer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Damage Histograph",
  description:
    "Forsaken Planet: Dungeons Of Eternity histogram of weapons' damages.",
};

export default async function Page() {
  const reports = await DungeonsOfEternityCache.FetchReports();
  return <Renderer reports={reports} />;
}
