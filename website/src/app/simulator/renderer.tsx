"use client";
import { InputText } from "primereact/inputtext";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { Slider } from "primereact/slider";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { useRef, useState, useEffect } from "react";
import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import Opponents from "@/models/Opponents";
import AttackStyles from "@/models/AttackStyles";
import { Simulator } from "./Simulator";
import SimulatorSelectables from "./SimulatorSelectables";
import update from "immutability-helper";

export default function Renderer({ reports }) {
  const toast = useRef(null);
  const [simulation, setSimulation] = useState(null);
  const [cache, setCache] = useState(new DungeonsOfEternityCache());
  const [selected, setSelected] = useState({
    gearName: null,
    damage: 50,
    damageTypeName: null,
    perk1Name: null,
    perk2Name: null,
    armEXOName: null,
    enemyName: null,
    attackStyle: null,
  });
  const [selectables, setSelectables] = useState(
    new SimulatorSelectables(cache),
  );
  const [damageTypeOptions, setDamageTypeOptions] = useState([]);

  useEffect(() => {
    const newCache = new DungeonsOfEternityCache(reports);
    setCache(newCache);
    const newSelectables = new SimulatorSelectables(newCache);
    setSelectables(newSelectables);
  }, [reports]);

  useEffect(() => {
    const damageTypesExcluded = ["shields", "staves"].includes(
      selected.gearName,
    );
    if (damageTypesExcluded) {
      setDamageTypeOptions([]);
    } else {
      setDamageTypeOptions(selectables.damageTypeNamesAsOptions);
    }
  }, [selected.gearName, selectables.damageTypeNamesAsOptions]);

  const onChange = (target: string, name: string) => {
    const newSelected = update(selected, {
      [name]: { $set: target },
    });
    setSelected(newSelected);
  };

  function onClick() {
    const simulator = new Simulator();
    let scenario = null;
    try {
      setSimulation(<Chart type="line" data={{}} options={{}} />);
      scenario = simulator.createScenario(selected);
    } catch (e) {
      toast.current.show({
        severity: "error",
        summary: "Error while creating scenario",
        detail: e.toString(),
      });
    }
    try {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--text-color");
      const textColorSecondary = documentStyle.getPropertyValue(
        "--text-color-secondary",
      );
      const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
      const output = simulator.simulate(scenario);
      const graphData = output.map((data) => {
        return data.reduce((a, b) => a + b, 0) / data.length;
      });
      const data = {
        labels: graphData.map((_d, i) => i.toString()),
        datasets: [
          {
            label: "simulation",
            data: graphData,
            fill: false,
            tension: 0.4,
            borderColor: documentStyle.getPropertyValue("--blue-500"),
          },
        ],
      };
      const options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
      setSimulation(<Chart type="line" data={data} options={options} />);
    } catch (e) {
      toast.current.show({
        severity: "error",
        summary: "Error while running simulation",
        detail: e.toString(),
      });
      setSimulation(null);
    }
  }

  return (
    <div className="surface-0 text-center">
      <Toast ref={toast} />
      <div className="mb-3 font-bold text-3xl">
        <span className="text-900">Damage Simulator</span>
      </div>
      <div className="text-700 mb-6">
        Select features for your damage simulation below:
      </div>
      <div className="grid">
        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <Dropdown
              value={{ name: selected.gearName, code: selected.gearName }}
              onChange={(e) => onChange(e.value.code, "gearName")}
              options={selectables.groupNamesAsOptions}
              optionLabel="name"
              placeholder="Select A Weapon"
            />
          </span>
          <div className="text-900 text-xl mb-3 font-medium">Weapon</div>
          <span className="text-700 line-height-3">
            Select the weapon your simulant will use in this fight scenario.
          </span>
        </div>
        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <InputText
              value={selected.damage}
              onChange={(e) => onChange(e.target.value, "damage")}
            />
            <Slider
              value={selected.damage}
              onChange={(e) => onChange(e.value, "damage")}
            />
          </span>
          <div className="text-900 text-xl mb-3 font-medium">Damage</div>
          <span className="text-700 line-height-3">
            Select your weapon&apos;s damage value.
          </span>
        </div>
        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <Dropdown
              value={{
                name: selected.damageTypeName,
                code: selected.damageTypeName,
              }}
              onChange={(e) => onChange(e.value.code, "damageTypeName")}
              options={damageTypeOptions}
              optionLabel="name"
              placeholder="Select Damage Type"
            />
          </span>
          <div className="text-900 text-xl mb-3 font-medium">
            Weapon&apos;s Damage Type
          </div>
          <span className="text-700 line-height-3">
            Select which element your weapon has or &quot;physical&quot;
          </span>
        </div>
        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <Dropdown
              value={{ name: selected.perk1Name, code: selected.perk1Name }}
              onChange={(e) => onChange(e.value.name, "perk1Name")}
              options={selectables.perkNamesAsOptions}
              optionLabel="name"
              placeholder="Select a Perk"
            />
          </span>
          <div className="text-900 text-xl mb-3 font-medium">
            First Weapon&apos;s Perk
          </div>
          <span className="text-700 line-height-3">
            Select your weapon&apos;s first perk (if any)
          </span>
        </div>
        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <Dropdown
              value={{ name: selected.perk2Name, code: selected.perk2Name }}
              onChange={(e) => onChange(e.value.name, "perk2Name")}
              options={selectables.perkNamesAsOptions}
              optionLabel="name"
              placeholder="Select a Perk"
            />
          </span>
          <div className="text-900 text-xl mb-3 font-medium">
            Second Weapon&apos;s Perk
          </div>
          <span className="text-700 line-height-3">
            Select your weapon&apos;s second perk (if any)
          </span>
        </div>
        <div className="col-12 md:col-4 md:mb-4 mb-0 px-3">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <Dropdown
              value={{ name: selected.armEXOName, code: selected.armEXOName }}
              onChange={(e) => onChange(e.value.name, "armEXOName")}
              options={selectables.armEXONamesAsOptions}
              optionLabel="name"
              placeholder="Select Arm EXO"
            />
          </span>
          <div className="text-900 text-xl mb-3 font-medium">Arm EXO Perk</div>
          <span className="text-700 line-height-3">
            Select your EXO suit&apos;s arm perk
          </span>
        </div>

        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <Dropdown
              value={{ name: selected.enemyName, code: selected.enemyName }}
              options={[...Object.keys(Opponents)].map((o) => ({
                name: o,
                code: o,
              }))}
              onChange={(e) => onChange(e.value.name, "enemyName")}
              optionLabel="name"
              placeholder="Select Enemy"
            />
          </span>
          <div className="text-900 text-xl mb-3 font-medium">Enemy</div>
          <span className="text-700 line-height-3">
            Select Enemy you will simulate fighting against.
          </span>
        </div>

        <div className="col-12 md:col-4 mb-4 px-5">
          <span
            className="p-3 shadow-2 mb-3 inline-block"
            style={{ borderRadius: "10px" }}
          >
            <Dropdown
              value={{ name: selected.attackStyle, code: selected.attackStyle }}
              options={[...Object.keys(AttackStyles)].map((o) => ({
                name: o,
                code: o,
              }))}
              onChange={(e) => onChange(e.value.name, "attackStyle")}
              optionLabel="name"
              placeholder="Select your attack style"
            />
          </span>
          <div className="text-900 text-xl mb-3 font-medium">Enemy</div>
          <span className="text-700 line-height-3">
            Select the style of attack you&apos;ll use
          </span>
        </div>
      </div>
      <Button label="Run Simulator" onClick={onClick} />
      {simulation}
    </div>
  );
}
