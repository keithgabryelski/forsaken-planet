import * as React from "react";
import { elementDescriptions } from "@/models/Elements";
import { perkDescriptions } from "@/models/Perks";
import { exoDescriptions } from "@/models/EXOs";

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

export function createEquation(scenario) {
  const equation = [
    {
      equationFragment: (
        <span className="text-orange-300">{scenario.damage}</span>
      ),
      equationComment: <span>normal damage</span>,
    },
  ];

  const dtDescription = elementDescriptions[scenario.elementName?.name];
  if (dtDescription) {
    const { chance, multiplier } = dtDescription;
    if (chance) {
      addToEquation(
        equation,
        scenario.damage,
        chance,
        multiplier,
        <span>element {scenario.elementName.name}</span>,
      );
    }
  }

  const perk1Description = perkDescriptions[scenario.perk1Name?.name];
  if (perk1Description) {
    const chance = perk1Description["max chance"];
    const multiplier = perk1Description["max multiplier"];
    if (chance) {
      let crossOut = false;
      if (perk1Description.limitsEffectToEnemy) {
        crossOut = !scenario.opponentIdentities
          .map((oi) => oi.name)
          .includes(perk1Description.limitsEffectToEnemy);
      }
      if (perk1Description.limitsEffectToAttackStyle) {
        crossOut =
          scenario.attackStyle !== perk1Description.limitsEffectToAttackStyle;
      }
      addToEquation(
        equation,
        scenario.damage,
        chance,
        multiplier,
        <span>perk1 {scenario.perk1Name.name}</span>,
        crossOut,
      );
    }
  }

  const perk2Description = perkDescriptions[scenario.perk2Name?.name];
  if (perk2Description) {
    const chance = perk2Description["max chance"];
    const multiplier = perk2Description["max multiplier"];
    if (chance) {
      let crossOut = false;
      if (perk2Description.limitsEffectToEnemy) {
        crossOut = !scenario.opponentIdentities
          .map((oi) => oi.name)
          .includes(perk2Description.limitsEffectToEnemy);
      }
      if (perk2Description.limitsEffectToAttackStyle) {
        crossOut =
          scenario.attackStyle !== perk2Description.limitsEffectToAttackStyle;
      }
      addToEquation(
        equation,
        scenario.damage,
        chance,
        multiplier,
        <span>perk2 {scenario.perk2Name.name}</span>,
        crossOut,
      );
    }
  }

  const exoDescription = exoDescriptions[scenario.armEXOName?.code];
  if (exoDescription) {
    const chance = exoDescription["max chance"];
    const multiplier = exoDescription["max multiplier"];
    if (chance) {
      let crossOut = false;
      if (exoDescription.limitsEffectToEnemy) {
        crossOut = !scenario.opponentIdentities
          .map((oi) => oi.code)
          .includes(exoDescription.limitsEffectToEnemy);
      }
      if (exoDescription.limitsEffectToAttackStyle) {
        crossOut =
          scenario.attackStyle.code !==
          exoDescription.limitsEffectToAttackStyle;
      }
      addToEquation(
        equation,
        scenario.damage,
        chance,
        multiplier,
        <span>exo {scenario.armEXOName.code}</span>,
        crossOut,
      );
    }
  }

  return equation;
}
