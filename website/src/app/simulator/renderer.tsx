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

function addToEquation(
  equation,
  damage,
  chance,
  multiplier,
  comment,
  crossOut = false,
) {
  const className = crossOut ? "line-through" : null;
  if (chance === 1) {
    equation.push({
      equationFragment: (
        <span className={className}>
          <span className="text-orange-300">{damage}</span> *{" "}
          <span className="text-purple-300">{multiplier}</span>
        </span>
      ),
      equationComment: <span>{comment}</span>,
    });
    return;
  }

  equation.push({
    equationFragment: (
      <span className={className}>
        <span className="text-orange-300">{damage}</span> * ({" "}
        <span className="text-yellow-300">Math.random()</span> &lt;{" "}
        <span className="text-blue-300">{chance}</span> ) ?{" "}
        <span className="text-purple-300">{multiplier}</span> :{" "}
        <span className="text-purple-300">0</span>
      </span>
    ),
    equationComment: <span>{comment}</span>,
  });
}

const config = {
  loader: { load: ["[tex]/html", "[tex]/color"] },
  tex: {
    packages: { "[+]": ["html", "color"] },
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

const elementAdjustments = Object.entries(elementDescriptions).map(
  ([elementName, elementDescription]) => ({
    id: elementName,
    name: elementName,
    ...elementDescription,
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
  const equation = [];
  equation.push({
    equationFragment: (
      <span className="text-orange-300">{selected.damage}</span>
    ),
    equationComment: <span>normal damage</span>,
  });
  const dtDescription = elementDescriptions[selected.elementName?.name];
  if (dtDescription) {
    const { chance, multiplier } = dtDescription;
    if (chance) {
      addToEquation(
        equation,
        selected.damage,
        chance,
        multiplier,
        <span>element {selected.elementName?.name}</span>,
      );
    }
  }

  const perk1Description = perkDescriptions[selected.perk1Name?.name];
  if (perk1Description) {
    const chance = perk1Description["max chance"];
    const multiplier = perk1Description["max multiplier"];
    if (chance) {
      let crossOut = false;
      if (perk1Description.limitsEffectToEnemy) {
        crossOut = !selected.opponentIdentities
          .map((oi) => oi.name)
          .includes(perk1Description.limitsEffectToEnemy);
      }
      if (perk1Description.limitsEffectToAttackStyle) {
        crossOut =
          selected.attackStyle?.name !==
          perk1Description.limitsEffectToAttackStyle;
      }
      addToEquation(
        equation,
        selected.damage,
        chance,
        multiplier,
        <span>perk1 {selected.perk1Name?.name}</span>,
        crossOut,
      );
    }
  }

  const perk2Description = perkDescriptions[selected.perk2Name?.name];
  if (perk2Description) {
    const chance = perk2Description["max chance"];
    const multiplier = perk2Description["max multiplier"];
    if (chance) {
      let crossOut = false;
      if (perk2Description.limitsEffectToEnemy) {
        crossOut = !selected.opponentIdentities.includes(
          perk2Description.limitsEffectToEnemy,
        );
      }
      if (perk2Description.limitsEffectToAttackStyle) {
        crossOut =
          selected.attackStyle?.name !==
          perk2Description.limitsEffectToAttackStyle;
      }
      addToEquation(
        equation,
        selected.damage,
        chance,
        multiplier,
        <span>perk2 {selected.perk2Name?.name}</span>,
        crossOut,
      );
    }
  }

  const exoDescription = exoDescriptions[selected.armEXOName?.name];
  if (exoDescription) {
    const chance = exoDescription["max chance"];
    const multiplier = exoDescription["max multiplier"];
    if (chance) {
      let crossOut = false;
      if (exoDescription.limitsEffectToEnemy) {
        crossOut = !selected.opponentIdentities.includes(
          exoDescription.limitsEffectToEnemy,
        );
      }
      if (exoDescription.limitsEffectToAttackStyle) {
        crossOut =
          selected.attackStyle?.name !==
          exoDescription.limitsEffectToAttackStyle;
      }
      addToEquation(
        equation,
        selected.damage,
        chance,
        multiplier,
        <span>exo {selected.armEXOName?.name}</span>,
        crossOut,
      );
    }
  }

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
            <MathJaxContext version={3} config={config}>
              <MathJax hideUntilTypeset={"first"}>
                {`$$\\sum_{a = adjustment_1}^{adjustment_n} f(a, {\\color{orange} baseDamage}, {\\color{yellow} rng})$$`}
              </MathJax>
              <MathJax hideUntilTypeset={"first"}>
                {`$$
                \\begin{eqnarray} \\\

                &&f(a,  {\\color{orange} baseDamage}, {\\color{yellow} rng}) =  \\begin{array} \\\
                {\\color{orange} baseDamage } \\cdot {\\color{violet} a^{multiplier}} &for& {\\color{yellow} \\mathcal{rng}} \\lt {\\color{lightblue} a^{chance}}

                \\end{array} \\\\

                \\end{eqnarray}

                $$`}
              </MathJax>
            </MathJaxContext>

            {equation.map((e, i, array) => (
              <div key={i.toString()} className="flex align-content-start">
                <div className="flex align-items-center justify-content-left w-10rem font-bold"></div>
                <div className="flex align-items-center justify-content-left w-20rem font-bold">
                  {e.equationFragment}
                </div>
                <div className="flex align-items-center justify-content-left w-10rem font-bold">
                  {i === array.length - 1 ? "" : "+"}
                </div>
                <div className="flex align-items-center justify-content-left w-20rem font-bold">
                  ({e.equationComment})
                </div>
                <div className="flex align-items-center justify-content-left w-10rem font-bold"></div>
              </div>
            ))}
          </Card>
        </AccordionTab>

        <AccordionTab header="Data Tables">
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
        </AccordionTab>
      </Accordion>

      <Button label="Run Simulator" onClick={onClick} />
      {simulation}
    </div>
  );
}
