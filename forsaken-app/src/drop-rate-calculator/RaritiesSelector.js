import { MultiSelect } from "primereact/multiselect";
import { Item, RarityItem } from "../models/Item";

function RaritiesSelector({ onChange, selectables }) {
  const source = selectables.rarities().filter((s) => s.isSource);
  const target = selectables.rarities().filter((s) => s.isTarget);
  const targetDropRate =
    target.length === 0 ? 1.0 : selectables.selectedRaritiesDropRate();
  const { percent, humanText } = Item.dropRatePercent(targetDropRate);
  const panelFooterTemplate = Item.footerTemplateFunc(
    target.length,
    percent,
    humanText,
  );

  return (
    <div className="card flex justify-content-center">
      <MultiSelect
        value={target}
        options={source}
        onChange={(event) => onChange(event.value)}
        optionLabel="name"
        placeholder="Select Rarities"
        itemTemplate={RarityItem.itemTemplate}
        panelFooterTemplate={panelFooterTemplate}
        className="w-full md:w-20rem"
        display="chip"
        showClear={true}
      />
    </div>
  );
}

export default RaritiesSelector;
