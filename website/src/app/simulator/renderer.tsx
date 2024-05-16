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
import update from "immutability-helper";
import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import { elementDescriptions } from "@/models/Elements";
import { perkDescriptions } from "@/models/Perks";
import { exoDescriptions } from "@/models/EXOs";
import { MultiSelect } from "primereact/multiselect";
import { OpponentIdentities } from "@/models/Opponents";
import { AttackStyles } from "@/models/AttackStyles";
import { Simulator } from "./Simulator";
import SimulatorSelectables from "./SimulatorSelectables";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import regression from "regression";
import RenderEquation from "./render-equation";
import RenderDatatables from "./render-datatables";
import { createEquation } from "./Equation";

const opponentIdentityOptions = OpponentIdentities.map((identity) => ({
  name: identity,
  code: identity,
}));

export default function Renderer({ reports }) {
  const toast = useRef(null);
  const [simulation, setSimulation] = useState(null);
  const [cache, setCache] = useState(new DungeonsOfEternityCache());
  const [selectables, setSelectables] = useState(
    new SimulatorSelectables(cache),
  );
  const [selected, setSelected] = useState({
    damage: 100,
    elementName: { name: "physical", code: "physical" },
    perk1Name: null,
    perk2Name: null,
    armEXOName: null,
    attackStyle: { name: "melee", code: "melee" },
    opponentIdentities: [],
  });

  useEffect(() => {
    const newCache = new DungeonsOfEternityCache(reports);
    setCache(newCache);
    const newSelectables = new SimulatorSelectables(newCache);
    setSelectables(newSelectables);
  }, [reports]);

  const onChange = (target: string | Array<string>, name: string) => {
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
      const output = (scenario && simulator.simulate(scenario)) || [[]];
      const graphData = output.map((data) => {
        return data.reduce((a, b) => a + b, 0) / data.length;
      });
      const data = {
        labels: graphData.map((_d, i) => i.toString()),
        datasets: [
          {
            label: "Attack Scenario",
            data: graphData,
            fill: false,
            tension: 0.4,
            borderColor: documentStyle.getPropertyValue("--blue-500"),
          },
          {
            label: "Trend",
            borderColor: "rgba(200,0,0)",
            backgroundColor: "rgba(200,0,0)",
            data: [],
            fill: false,
          },
        ],
      };
      const options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            title: {
              text: "Simulation Run",
              display: true,
              color: "white",
              font: {
                size: 24,
              },
            },
            labels: {
              color: textColor,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Attack Round",
            },
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            title: {
              display: true,
              text: "Damage",
            },
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };

      // Declare the array which will contains calculated point of trend line
      const arrayForRegression = data.datasets[0].data.map((datum, i) => [
        i,
        datum,
      ]);
      // Calculare linear regression
      const regr = regression.linear(arrayForRegression);
      const [gradient, yIntercept] = regr.equation;
      data.datasets[1].data = data.datasets[0].data.map((_datum, i) => [
        i,
        i * gradient + yIntercept,
      ]);

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
      <Accordion activeIndex={0}>
        <AccordionTab header="Scenario Configuration">
          <div className="grid">
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
                  min={1}
                  max={200}
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
                  value={selected.elementName}
                  onChange={(e) => onChange(e.value, "elementName")}
                  options={selectables.elementNamesAsOptions}
                  optionLabel="name"
                  placeholder="Select Element"
                />
              </span>
              <div className="text-900 text-xl mb-3 font-medium">
                Weapon&apos;s Element
              </div>
              <span className="text-700 line-height-3">
                {elementDescriptions[selected.elementName?.name]?.description ||
                  'Select which element your weapon has or "physical"'}
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
                {perkDescriptions[selected.perk1Name?.name]?.description ||
                  "Select your weapon's first perk (if any)"}
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
                {perkDescriptions[selected.perk2Name?.name]?.description ||
                  "Select your weapon's second perk (if any)"}
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
                {exoDescriptions[selected.armEXOName?.name]?.description ||
                  "Select your EXO suit's arm perk"}
              </span>
            </div>

            <div className="col-12 md:col-4 mb-4 px-5">
              <span
                className="p-3 shadow-2 mb-3 inline-block"
                style={{ borderRadius: "10px" }}
              >
                <MultiSelect
                  value={selected.opponentIdentities}
                  onChange={(e) => onChange(e.value, "opponentIdentities")}
                  options={opponentIdentityOptions}
                  optionLabel="name"
                  placeholder="Select Enemy Identities"
                  maxSelectedLabels={3}
                  showSelectAll={false}
                  className="w-full md:w-20rem"
                />
              </span>
              <div className="text-900 text-xl mb-3 font-medium">Enemy</div>
              <span className="text-700 line-height-3">
                Select how your enemy identifies. This relates to which perks
                (i.e., &ldquo;monster damage&rdquo;, &ldquo;sorcerer
                damage&rdquo;, &ldquo;critter damage&rdquo;) can affect them.
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
                Select the style of attack you&apos;ll use. This affects which
                perks/EXOs can buff your attack.
              </span>
            </div>
          </div>

          <Card title="Maths" className="border-white border-1">
            <RenderEquation equation={createEquation(selected)} />
          </Card>
        </AccordionTab>

        <AccordionTab header="Data Tables">
          <RenderDatatables />
        </AccordionTab>
      </Accordion>

      <Button label="Run Simulator" onClick={onClick} />
      {simulation}
    </div>
  );
}
