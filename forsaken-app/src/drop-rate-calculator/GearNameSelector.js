import { Item, GearItem } from "./models/Item";
import { MultiSelect } from "primereact/multiselect";

function GearNameSelector({ onChange, selectables }) {
  const source = selectables.gear().filter((s) => s.isSource && s.isTargetable);
  const target = selectables.gear().filter((s) => s.isTarget);
  const targetDropRate =
    target.length === 0 ? 1.0 : selectables.selectedGearDropRate();
  const { percent, humanText } = Item.dropRatePercent(targetDropRate);
  const targetHeader = `Selected Gear Names: ${percent}% (${humanText})`;

  const panelFooterTemplate = () => {
    const length = target.length;

    return (
      <div className="py-2 px-3">
        <b>{length}</b> item{length > 1 ? "s" : ""} selected.
      </div>
    );
  };

  return (
    <div className="card flex justify-content-center">
      <MultiSelect
        value={target}
        options={source}
        onChange={(event) => onChange(event.value)}
        optionLabel="name"
        placeholder="Select Gear"
        itemTemplate={GearItem.itemTemplate}
        panelFooterTemplate={panelFooterTemplate}
        className="w-full md:w-20rem"
        display="chip"
        showSelectAll={false}
      />
    </div>
  );
}

export default GearNameSelector;
