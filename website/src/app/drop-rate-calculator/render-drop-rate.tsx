import { Item } from "@/models/Item";

function DropRate({ selectables }) {
  const { statistics, selected } = selectables;
  const { gearNames, rarities, elements, perks } = selected;
  const { byGroup, byRarity, byElement, byPerk } = statistics;

  const namesDropRate = Item.dropRate(gearNames, byGroup);
  const raritiesDropRate = Item.dropRate(rarities, byRarity);
  const elementsDropRate = Item.dropRate(elements, byElement);
  const perksDropRate = Item.dropRate(perks, byPerk, "and");

  const total =
    namesDropRate * raritiesDropRate * elementsDropRate * perksDropRate;

  const { percent, humanText } = Item.dropRatePercent(total);

  return (
    <div className="text-5xl">
      ={percent}% ({humanText})
    </div>
  );
}

export default DropRate;
