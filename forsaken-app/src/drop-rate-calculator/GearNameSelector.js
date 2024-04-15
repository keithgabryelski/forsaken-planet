import { Item, GearItem } from "../models/Item";
import { MultiSelect } from "primereact/multiselect";

function GearNameSelector({ onChange, selectables }) {
  const source = selectables.gear().filter((s) => s.isSource && s.isTargetable);
  const target = selectables.gear().filter((s) => s.isTarget);
  const targetDropRate =
    target.length === 0 ? 1.0 : selectables.selectedGearDropRate();
  const { percent, humanText } = Item.dropRatePercent(targetDropRate);
  const panelFooterTemplate = Item.footerTemplateFunc(
    target.length,
    percent,
    humanText,
  );

  return (
    <MultiSelect
      value={target}
      options={source}
      onChange={(event) => onChange(event.value)}
      optionLabel="name"
      placeholder="Select Gear"
      itemTemplate={GearItem.itemTemplate}
      panelFooterTemplate={panelFooterTemplate}
      display="chip"
      showSelectAll={false}
    />
  );
}

export default GearNameSelector;
