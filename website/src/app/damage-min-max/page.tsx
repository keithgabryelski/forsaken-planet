import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import Renderer from "./renderer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Damage MIN/MAX Bar Chart",
  description:
    "Forsaken Planet: Dungeons Of Eternity min/max ranges for all weapons.",
};

export default async function Page() {
  const reports = await DungeonsOfEternityCache.FetchReports();
  return <Renderer reports={reports} />;
}
