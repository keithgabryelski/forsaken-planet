import { MultiSelect } from "primereact/multiselect";
import { Item, PerkItem } from "../models/Item";

function PerksSelector({ onChange, selectables }) {
  let source = selectables.perks().filter((s) => s.isSource && s.isTargetable);
  const target = selectables.perks().filter((s) => s.isTarget);
  const targetDropRate =
    target.length === 0 ? 1.0 : selectables.selectedPerksDropRate();
  const { percent, humanText } = Item.dropRatePercent(targetDropRate);
  const panelFooterTemplate = Item.footerTemplateFunc(
    target.length,
    percent,
    humanText,
  );

  if (target.length === 2) {
    source = [];
  }

  return (
    <div className="card flex justify-content-center">
      <MultiSelect
        value={target}
        options={source}
        onChange={(event) => onChange(event.value)}
        optionLabel="name"
        placeholder="Select Perks"
        itemTemplate={PerkItem.itemTemplate}
        panelFooterTemplate={panelFooterTemplate}
        className="w-full md:w-20rem"
        display="chip"
        selectionLimit={2}
        showSelectAll={false}
      />
    </div>
  );
}

export default PerksSelector;
