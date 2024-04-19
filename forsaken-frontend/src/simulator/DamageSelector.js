import { Slider } from "primereact/slider";
import { InputText } from "primereact/inputtext";

export default function GearNameSelector({ damage, onChange }) {
  return (
    <div className="w-14rem">
      <InputText
        value={damage}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
      <Slider
        value={damage}
        onChange={(e) => onChange(e.value)}
        className="w-full"
      />
    </div>
  );
}
