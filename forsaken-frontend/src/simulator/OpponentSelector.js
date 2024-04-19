import { Dropdown } from "primereact/dropdown";
import Opponents from "../models/Opponents";

export default function DamageTypesSelector({ onChange, selectables }) {
  const sources = selectables.damageTypes();
  const target = selectables.damageTypes().filter((s) => s.isTarget)[0];

  return (
    <Dropdown
      value={target}
      options={sources}
      onChange={(event) => onChange([event.value])}
      optionLabel="name"
      placeholder="Select Damage Type"
    />
  );
}
