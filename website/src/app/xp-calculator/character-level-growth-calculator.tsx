"use client";

import { useState, useEffect } from "react";
import { InputNumber } from "primereact/inputnumber";
import { MAX_LEVEL } from "./utils";

export default function CharacterLevelGrowthCalculator() {
  const [error, setError] = useState(null);
  const [xpGained, setXPGained] = useState(782673);
  const [initialLevel, setInitialLevel] = useState(6);
  const [Lf, setLF] = useState(0);

  useEffect(() => {
    const Li = initialLevel;
    const dxp = xpGained;
    if (isNaN(Li) || Li > 60 || Li < 1) {
      setError(
        "The initial Character Level must be a number between 1 and " +
          MAX_LEVEL +
          ".",
      );
      return;
    }
    if (isNaN(dxp) || dxp < 1) {
      setError("The experience gained must be a number greater than 1. ");
      return;
    }
    const ni = Math.floor(Li);
    const eps = Li - ni;
    const fxp = Math.floor(eps * (ni + 1) * 500);
    const nf = Math.floor(
      (Math.sqrt(1 + 4 * ((dxp + fxp) / 250 + ni * (ni + 1))) - 1) / 2,
    );
    setLF(
      nf +
        (dxp + fxp + 250 * (ni * (ni + 1) - nf * (nf + 1))) / (500 * (nf + 1)),
    );
    setError(null);
  }, [setError, initialLevel, xpGained, setLF]);

  const results =
    error != null ? (
      <div className="text-red-300">{error}</div>
    ) : (
      <p>
        If a character at level {initialLevel} gains {xpGained}; experience
        points, then the character
        {Lf > initialLevel ? "will advance to" : "will remain at"}
        level {Math.round(100 * Lf) / 100}.
      </p>
    );
  return (
    <div>
      <div className="grid">
        <div className="col-2">
          <label
            htmlFor="initial-character-level"
            className="font-bold block mb-2"
          >
            Initial Character Level
          </label>
        </div>
        <div className="col-6">
          <InputNumber
            inputId="initial-character-level"
            value={initialLevel}
            onValueChange={(e) => setInitialLevel(e.value)}
          />
        </div>
      </div>
      <div className="grid">
        <div className="col-2">
          <label
            htmlFor="initial-character-level"
            className="font-bold block mb-2"
          >
            Experience Points Gained
          </label>
        </div>
        <div className="col-6">
          <InputNumber
            inputId="xp-gained"
            value={xpGained}
            onValueChange={(e) => setXPGained(e.value)}
          />
        </div>
      </div>

      {results}
    </div>
  );
}
