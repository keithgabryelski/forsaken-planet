"use client";
import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import { damageTypeDescriptions } from "@/models/DamageTypes";
import { perkDescriptions } from "@/models/Perks";
import { exoDescriptions } from "@/models/EXOs";
//import { OpponentIdentities } from "@/models/Opponents";
import { AttackStyles } from "@/models/AttackStyles";
import { Simulator } from "../simulator/Simulator";
//import SimulatorSelectables from "../simulator/SimulatorSelectables";
import regression from "regression";

function addToEquation(
  equation,
  damage,
  chance,
  multiplier,
  comment,
  crossOut = false,
) {
  if (chance === 1) {
    equation.push({
      crossOut,
      equationFragment: `${damage} * ${multiplier}`,
      equationComment: comment,
    });
    return;
  }

  equation.push({
    crossOut,
    equationFragment: `${damage} * (Math.random() < ${chance}) ? ${multiplier} : 0`,
    equationComment: comment,
  });
}

export default function Renderer({ reports }) {
  const analysis = [];

  const simulator = new Simulator();
  const cache = new DungeonsOfEternityCache(reports);
  //  const selectables = new SimulatorSelectables(cache);

  const perkPicks = [];
  const allPerks = [...cache.catalog.perks].filter((p) =>
    Boolean(perkDescriptions[p]["max multiplier"]),
  );
  for (let p1 = 0; p1 < allPerks.length; ++p1) {
    for (let p2 = p1 + 1; p2 < allPerks.length; ++p2) {
      perkPicks.push([allPerks[p1], allPerks[p2]]);
    }
  }

  const exoPicks = Object.keys(exoDescriptions).filter((e) =>
    Boolean(exoDescriptions[e]["max multiplier"]),
  );

  const groupNames = [...cache.catalog.groupNames].filter(
    (g) => !["staves", "shields"].includes(g),
  );

  const damageTypes = ["physical", "fire"];

  let n = 0;
  const total =
    groupNames.length *
    damageTypes.length *
    perkPicks.length *
    exoPicks.length *
    [...Object.keys(AttackStyles)].length *
    [
      ["sorcerer"],
      ["elite"],
      ["undead"],
      ["monster"],
      ["elemental"],
      ["critter"],
    ].length;

  console.info("total", total);

  for (const groupName of groupNames) {
    const byGroup = cache.indexes.byGroup.get(groupName);
    const damage = byGroup.reduce((a, e) => Math.max(a, e.Damage || 0), 0);
    console.info(n, "groupName", groupName, "damage", damage, new Date());
    for (const damageTypeName of damageTypes) {
      //console.info("damageTypeName", damageTypeName);
      for (const perkPick of perkPicks) {
        for (const armEXOName of exoPicks) {
          //console.info("armEXOName", armEXOName);
          for (const attackStyle of Object.keys(AttackStyles)) {
            //console.info("attackStyle", attackStyle);
            for (const opponentIdentity of [
              ["sorcerer"],
              ["elite"],
              ["undead"],
              ["monster"],
              ["elemental"],
              ["critter"],
            ]) {
              //console.info("opponentIdentity", opponentIdentity);
              // get max(damage)
              const selected = {
                groupName,
                damageTypeName,
                perk1Name: perkPick[0],
                perk2Name: perkPick[1],
                armEXOName,
                damage,
                attackStyle,
                opponentIdentities: [opponentIdentity],
                equation: [],
                output: [],
                gradient: 0,
                yIntercept: 0,
              };

              selected.equation.push({
                equationFragment: selected.damage,
                equationComment: "normal damage",
              });
              const dtDescription =
                damageTypeDescriptions[selected.damageTypeName];
              if (dtDescription) {
                const { chance, multiplier } = dtDescription;
                if (chance) {
                  addToEquation(
                    selected.equation,
                    selected.damage,
                    chance,
                    multiplier,
                    `damage-type ${selected.damageTypeName}`,
                  );
                }
              }

              const perk1Description = perkDescriptions[selected.perk1Name];
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
                      selected.attackStyle !==
                      perk1Description.limitsEffectToAttackStyle;
                  }
                  addToEquation(
                    selected.equation,
                    selected.damage,
                    chance,
                    multiplier,
                    `perk1 ${selected.perk1Name}`,
                    crossOut,
                  );
                }
              }

              const perk2Description = perkDescriptions[selected.perk2Name];
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
                      selected.attackStyle !==
                      perk2Description.limitsEffectToAttackStyle;
                  }
                  addToEquation(
                    selected.equation,
                    selected.damage,
                    chance,
                    multiplier,
                    `perk2 ${selected.perk2Name}`,
                    crossOut,
                  );
                }
              }

              const exoDescription = exoDescriptions[selected.armEXOName];
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
                      selected.attackStyle !==
                      exoDescription.limitsEffectToAttackStyle;
                  }
                  addToEquation(
                    selected.equation,
                    selected.damage,
                    chance,
                    multiplier,
                    `exo ${selected.armEXOName}`,
                    crossOut,
                  );
                }
              }

              const scenario = simulator.createScenarioSimple(selected);
              const output = simulator.simulate(scenario) || [[]];
              selected.output = output.map((data) => {
                return data.reduce((a, b) => a + b, 0) / data.length;
              });
              // Declare the array which will contains calculated point of trend line
              const arrayForRegression = selected.output.map((datum, i) => [
                i,
                datum,
              ]);
              // Calculate linear regression
              const regr = regression.linear(arrayForRegression);
              selected.gradient = regr.equation[0];
              selected.yIntercept = regr.equation[1];

              const string = `${selected.gradient}x${Math.round(selected.yIntercept)}`;
              //const string = regr.string;
              if (!analysis[string]) {
                analysis[string] = {
                  scenarios: [],
                };
              }
              analysis[string].scenarios.push({
                gradient: selected.gradient,
                yIntercept: selected.yIntercept,
                groupName,
                damageTypeName,
                perkPick,
                armEXOName,
                damage,
                attackStyle,
                opponentIdentity,
                equation: selected.equation,
              });

              if (n % 10000 === 0) {
                console.info(
                  new Date(),
                  "staged analysis",
                  n,
                  [...Object.entries(analysis)].map(
                    ([k, a]) => `${k} -> ${a.scenarios.length}`,
                  ),
                );
              }
              n += 1;
            }
          }
        }
      }
    }
  }
  console.info("================= FINAL ==================");
  console.info(
    "analysis",
    n,
    [...Object.entries(analysis)].map(([k, a]) => `${k} -> ${a.length}`),
  );

  console.info("================= ANALYSIS ==================");
  console.info(JSON.stringify([...Object.entries(analysis)], undefined, 2));
  console.info("================= END ==================");
  return null;
}
