import { Item } from "@/models/Item";

function DropRate({ selectables }) {
  const { statistics, selected } = selectables;
  const { gearNames, rarities, damageTypes, perks } = selected;
  const { byGroup, byRarity, byDamageType, byPerk } = statistics;

  const namesDropRate = Item.dropRate(gearNames, byGroup);
  const raritiesDropRate = Item.dropRate(rarities, byRarity);
  const damageTypesDropRate = Item.dropRate(damageTypes, byDamageType);
  const perksDropRate = Item.dropRate(perks, byPerk, "and");

  const total =
    namesDropRate * raritiesDropRate * damageTypesDropRate * perksDropRate;

  const { percent, humanText } = Item.dropRatePercent(total);

  return (
    <div className="text-5xl">
      ={percent}% ({humanText})
    </div>
  );
}

export default DropRate;
