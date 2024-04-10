import { MultiSelect } from "primereact/multiselect";
import { Item, DamageTypeItem } from "../models/Item";

function DamageTypesSelector({ onChange, selectables }) {
  let source = selectables.damageTypes().filter((s) => s.isSource);
  const damageTypesExcluded = selectables
    .selectedGear()
    .some((item) => ["shields", "staves"].includes(item.name));
  if (damageTypesExcluded) {
    source = [];
  }
  const target = selectables.damageTypes().filter((s) => s.isTarget);
  const targetDropRate =
    target.length === 0 ? 1.0 : selectables.selectedDamageTypesDropRate();
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
        placeholder="Select Damage Types"
        itemTemplate={DamageTypeItem.itemTemplate}
        panelFooterTemplate={panelFooterTemplate}
        className="w-full md:w-20rem"
        display="chip"
        showSelectAll={false}
      />
    </div>
  );
}

export default DamageTypesSelector;
