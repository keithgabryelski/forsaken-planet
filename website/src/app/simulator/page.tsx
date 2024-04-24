import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import Renderer from "./renderer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Attack Simulator",
  description:
    "Forsaken Planet: Dungeons Of Eternity attack simulator for a given weapon with specific perks, " +
    "exo suit perks, against a specific enemy.",
};

export default async function SimulatorPage() {
  const reports = await DungeonsOfEternityCache.FetchReports();
  return <Renderer reports={reports} />;
}
