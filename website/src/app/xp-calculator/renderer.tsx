"use client";

import * as React from "react";
import { TabView, TabPanel } from "primereact/tabview";
import RecommendedDungeonTierCalculator from "./recommended-dungeon-tier-calculator";
import CharacterLevelGrowthCalculator from "./character-level-growth-calculator";
import GainingExperiencePoints from "./gaining-experience-points";
import XPTable from "./xp-table";

export default function XPCalculator() {
  return (
    <div className="card">
      <TabView>
        <TabPanel header="Recommended Dungeon Tier Calculator">
          <RecommendedDungeonTierCalculator />
        </TabPanel>
        <TabPanel header="Experience and Character Levels">
          <XPTable />
          <h3>Character Level Growth Calculator:</h3>
          <CharacterLevelGrowthCalculator />
        </TabPanel>
        <TabPanel header="Gaining Experience Points">
          <GainingExperiencePoints />
        </TabPanel>
      </TabView>
      <h5>This page written and maintained by ActionManPQ2pq</h5>
    </div>
  );
}
