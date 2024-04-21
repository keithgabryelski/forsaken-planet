"use client";
import { useRef, useState, useEffect } from "react";
import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export default function Renderer({ reports }) {
  const [cache, setCache] = useState(new DungeonsOfEternityCache());
  const dt = useRef(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    setCache(new DungeonsOfEternityCache(reports));
  }, [reports]);

  useEffect(() => {
    setResults(
      cache.drops.map((r) =>
        Object.assign(r, {
          perks: [r.Perk1, r.Perk2].filter(Boolean).sort().join(","),
        }),
      ),
    );
  }, [cache.drops]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };

  const renderHeader = () => {
    return (
      <div>
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
        />
        <Button
          type="button"
          rounded
          onClick={() => exportCSV(false)}
          data-pr-tooltip="CSV"
        >
          CSV
        </Button>
      </div>
    );
  };

  const header = renderHeader();

  return (
    <DataTable
      ref={dt}
      resizableColumns
      showGridlines
      stripedRows
      value={results}
      sortMode="multiple"
      dataKey="rowID"
      loading={false}
      header={header}
      filters={filters}
      globalFilterFields={["Name", "Group", "Rarity", "DamageType", "perks"]}
      emptyMessage="No drops found."
    >
      <Column field="Group" header="Group Name" sortable />
      <Column field="Name" header="Name" sortable />
      <Column field="Rarity" header="Rarity" sortable />
      <Column field="Damage" header="Damage" sortable />
      <Column field="DamageType" header="Damage Type" sortable />
      <Column field="Cost" header="Cost" sortable />
      <Column field="perks" header="Perks" sortable />
    </DataTable>
  );
}
