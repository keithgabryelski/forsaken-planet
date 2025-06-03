import Renderer from "./renderer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dungeons Of Eternity XP Calculator",
  description: "Dungeons Of Eternity XP Calculator by ActionManPQ2pq",
};

export default async function Page() {
  return <Renderer />;
}
