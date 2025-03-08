import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { elementDescriptions } from "@/models/Elements";
import { perkDescriptions } from "@/models/Perks";
import { exoDescriptions } from "@/models/EXOs";

const elementAdjustments = Object.entries(elementDescriptions).map(
  ([elementName, elementDescription]) => ({
    id: elementName,
    name: elementName,
    ...(elementDescription as object),
  }),
);
const perkAdjustments = Object.entries(perkDescriptions).map(
  ([perkName, perkDescription]) => ({
    id: perkName,
    name: perkName,
    ...perkDescription,
  }),
);
const armEXOAdjustments = Object.entries(exoDescriptions)
  .filter(([_exoName, exoDescription]) => exoDescription.placement === "Arms")
  .map(([armEXOName, armEXODescription]) => ({
    id: armEXOName,
    name: armEXOName,
    ...armEXODescription,
  }));

export default function RenderDatatables() {
  return (
    <div className="grid">
      <Card title="Element Adjustments">
        <DataTable
          value={elementAdjustments}
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="name" header="Name"></Column>
          <Column field="chance" header="Chance"></Column>
          <Column field="multiplier" header="Multiplier"></Column>
          <Column field="description" header="Description"></Column>
        </DataTable>
      </Card>

      <Card title="Perk Adjustments">
        <DataTable
          value={perkAdjustments}
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="name" header="Name"></Column>
          <Column field="type" header="Type"></Column>
          <Column field="max chance" header="Chance"></Column>
          <Column field="max multiplier" header="Multiplier"></Column>
          <Column field="description" header="Description"></Column>
        </DataTable>
      </Card>

      <Card title="Arm EXO Adjustments">
        <DataTable
          value={armEXOAdjustments}
          stripedRows
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="name" header="Name"></Column>
          <Column field="max chance" header="Chance"></Column>
          <Column field="max multiplier" header="Multiplier"></Column>
          <Column field="description" header="Description"></Column>
        </DataTable>
      </Card>
    </div>
  );
}
