"use client";
import { useRef, useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Slider } from "primereact/slider";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import chartTrendline from "chartjs-plugin-trendline";
import update from "immutability-helper";
import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import {
  damageTypeDescriptions,
  perkDescriptions,
  exoDescriptions,
} from "@/models/DungeonsOfEternityPerkMatrices";
import Opponents from "@/models/Opponents";
import AttackStyles from "@/models/AttackStyles";
import { Simulator } from "./Simulator";
import SimulatorSelectables from "./SimulatorSelectables";
import { MathJaxContext, MathJax } from "better-react-mathjax";

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
};

const damageTypeAdjustments = Object.entries(damageTypeDescriptions).map(
  ([damageTypeName, damageTypeDescription]) => ({
    id: damageTypeName,
    name: damageTypeName,
    ...damageTypeDescription,
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

export default function Renderer({ reports }) {
  const toast = useRef(null);
  const [simulation, setSimulation] = useState(null);
  const [cache, setCache] = useState(new DungeonsOfEternityCache());
  const [selectables, setSelectables] = useState(
    new SimulatorSelectables(cache),
  );
  const [selected, setSelected] = useState({
    gearName: null,
    damage: 50,
    damageTypeName: selectables.damageTypeNamesAsOptions[0],
    perk1Name: null,
    perk2Name: null,
    armEXOName: null,
    enemyName: null,
    attackStyle: null,
  });
  const [damageTypeOptions, setDamageTypeOptions] = useState(true);

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
    setDamageTypeOptions(!damageTypesExcluded);
  }, [selected.gearName]);

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
            trendlineLinear: {
              colorMin: "red",
              colorMax: "red",
              lineStyle: "solid",
              width: 2,
            },
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
      setSimulation(
        <Chart
          type="line"
          data={data}
          options={options}
          plugins={[chartTrendline]}
        />,
      );
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
      <Accordion activeIndex={0}>
        <AccordionTab header="Scenario Configuration">
          <div className="grid">
            <div className="col-12 md:col-4 mb-4 px-5">
              <span
                className="p-3 shadow-2 mb-3 inline-block"
                style={{ borderRadius: "10px" }}
              >
                <Dropdown
                  value={selected.gearName}
                  onChange={(e) => onChange(e.value, "gearName")}
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
                  value={selected.damageTypeName}
                  onChange={(e) => onChange(e.value, "damageTypeName")}
                  options={
                    damageTypeOptions
                      ? selectables.damageTypeNamesAsOptions
                      : []
                  }
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
                  value={selected.perk1Name}
                  onChange={(e) => onChange(e.value, "perk1Name")}
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
                  value={selected.perk2Name}
                  onChange={(e) => onChange(e.value, "perk2Name")}
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
                  value={selected.armEXOName}
                  onChange={(e) => onChange(e.value, "armEXOName")}
                  options={selectables.armEXONamesAsOptions}
                  optionLabel="name"
                  placeholder="Select Arm EXO"
                />
              </span>
              <div className="text-900 text-xl mb-3 font-medium">
                Arm EXO Perk
              </div>
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
                  value={selected.enemyName}
                  options={[...Object.keys(Opponents)].map((o) => ({
                    name: o,
                    code: o,
                  }))}
                  onChange={(e) => onChange(e.value, "enemyName")}
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
                  value={selected.attackStyle}
                  options={[...Object.keys(AttackStyles)].map((o) => ({
                    name: o,
                    code: o,
                  }))}
                  onChange={(e) => onChange(e.value, "attackStyle")}
                  optionLabel="name"
                  placeholder="Select your attack style"
                />
              </span>
              <div className="text-900 text-xl mb-3 font-medium">
                Attack Style
              </div>
              <span className="text-700 line-height-3">
                Select the style of attack you&apos;ll use
              </span>
            </div>

            <div className="col-12 md:col-4 mb-4 px-5">
              <span
                className="p-3 shadow-2 mb-3 inline-block"
                style={{ borderRadius: "10px" }}
              ></span>
            </div>
          </div>
        </AccordionTab>

        <AccordionTab header="Maths">
          <MathJaxContext version={3} config={config}>
            <MathJax hideUntilTypeset={"first"}>
              {`$$\\sum_{a = adjustment_1}^{adjustment_n} f(a, baseDamage)$$`}
            </MathJax>
            <MathJax hideUntilTypeset={"first"}>
              {`$$
      \\begin{eqnarray} \\\

      &&f(a, baseDamage) =  \\begin{array} \\\
      baseDamage \\cdot a^{multiplier} &for& \\mathcal{rng} \\lt a^{chance},
      \\mathcal{rng} \\in \\mathbb{R}, \\mathcal{rng} \\in [0,1]  \\\\

      \\end{array} \\\\


      \\end{eqnarray}

      $$`}
            </MathJax>
          </MathJaxContext>
        </AccordionTab>

        <AccordionTab header="Data Tables">
          <div className="grid">
            <Card title="Damage Type Adjustments">
              <DataTable
                value={damageTypeAdjustments}
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
        </AccordionTab>
      </Accordion>

      <Button label="Run Simulator" onClick={onClick} />
      {simulation}
    </div>
  );
}
