import { MultiSelect } from "primereact/multiselect";
import { Item, ElementItem } from "@/models/Item";

export default function RenderElementsSelector({ onChange, selectables }) {
  let source = selectables.elements().filter((s) => s.isSource);
  const elementsExcluded = selectables
    .selectedGear()
    .some((item) => ["shields", "staves"].includes(item.name));
  if (elementsExcluded) {
    source = [];
  }
  const target = selectables.elements().filter((s) => s.isTarget);
  const targetDropRate =
    target.length === 0 ? 1.0 : selectables.selectedElementsDropRate();
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
      placeholder="Select Elements"
      itemTemplate={ElementItem.itemTemplate}
      panelFooterTemplate={panelFooterTemplate}
      display="chip"
      showSelectAll={false}
    />
  );
}
