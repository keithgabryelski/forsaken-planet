import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import Renderer from "./renderer.tsx";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Drop Rate Pie Chart",
  description:
    "Forsaken Planet: Dungeons Of Eternity gear drop-rate pie chart.",
};

export default async function DropRatePieChart() {
  const cache = await DungeonsOfEternityCache.Factory();
  return <Renderer drops={cache.drops} />;
}
