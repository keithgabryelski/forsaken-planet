import { Dropdown } from "primereact/dropdown";

export default function GearNameSelector({ onChange, selectables }) {
  const source = selectables.gear();
  const target = selectables.gear().filter((s) => s.isTarget)[0];

  return (
    <Dropdown
      value={target}
      options={source}
      onChange={(event) => onChange([event.value])}
      optionLabel="name"
      placeholder="Select Gear"
    />
  );
}
