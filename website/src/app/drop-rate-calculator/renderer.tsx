"use client";
import { useState, useEffect } from "react";
import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import Selectables from "@/models/Selectables";
import update from "immutability-helper";
import { Item } from "@/models/Item";
import RenderOhDuh from "./render-ohduh";
import RenderNotes from "./render-notes";
import RenderDropRate from "./render-drop-rate";
import RenderGearNameSelector from "./render-gear-name-selector";
import RenderRaritiesSelector from "./render-rarities-selector";
import RenderDamageTypesSelector from "./render-damage-types-selector";
import RenderPerksSelector from "./render-perks-selector";

export default function Renderer({ reports }) {
  const [cache, setCache] = useState(new DungeonsOfEternityCache());

  const [selected, setSelected] = useState({
    gearNames: [],
    rarities: [],
    damageTypes: [],
    perks: [],
    damageMin: null,
    damageMax: null,
  });

  const [selectables, setSelectables] = useState(
    new Selectables(cache, selected),
  );

  useEffect(() => {
    const newCache = new DungeonsOfEternityCache(reports);
    setCache(newCache);
    setSelectables(new Selectables(newCache, selected));
  }, [reports, selected]);

  const onChange = (targets, name) => {
    const targetable = Item.isTargetable(targets);
    if (!targetable) {
      console.warn("is not", name, "targetable", targets);
      return;
    }
    const newSelected = update(selected, {
      [name]: { $set: targets.map((t) => t.name) },
    });
    setSelected(newSelected);
  };

  return (
    <div className="flex flex-column">
      <RenderOhDuh />
      <RenderGearNameSelector
        selectables={selectables}
        onChange={(targets) => onChange(targets, "gearNames")}
      />
      <RenderRaritiesSelector
        selectables={selectables}
        onChange={(targets) => onChange(targets, "rarities")}
      />
      <RenderDamageTypesSelector
        selectables={selectables}
        onChange={(targets) => onChange(targets, "damageTypes")}
      />
      <RenderPerksSelector
        selectables={selectables}
        onChange={(targets) => onChange(targets, "perks")}
      />
      <RenderDropRate selectables={selectables} />
      <RenderNotes selectables={selectables} />
    </div>
  );
}
