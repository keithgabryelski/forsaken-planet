import { DungeonsOfEternityCache } from "@/models/DungeonsOfEternityCache";
import Renderer from "./renderer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dungeons Of Eternity Drop Rate Pie Chart",
  description: "Dungeons Of Eternity gear drop-rate pie chart.",
};

export default async function DropRatePieChart() {
  const cache = await DungeonsOfEternityCache.Factory();
  return <Renderer drops={cache.drops} />;
}
