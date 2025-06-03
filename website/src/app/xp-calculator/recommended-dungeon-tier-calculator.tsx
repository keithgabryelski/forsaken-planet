"use client";

import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { MAX_LEVEL, MAX_TIER, plural, possessive, preposition } from "./utils";

export default function RecommendedDungeonTierCalculator() {
  const [partyLevels, setPartyLevels] = useState("24.5, 23.2, 7.66, 7.66");
  const [error, setError] = useState(null);
  const [recommendedDungeonTier, setRecommendedDungeonTier] = useState(7);
  const [recommendedDungeonTierWarn, setRecommendedDungeonTierWarn] =
    useState(7);
  const [partySize, setPartySize] = useState(4);
  const [partyLevelsArray, setPartyLevelsArray] = useState([
    24.5, 23.2, 7.66, 7.66,
  ]);

  useEffect(() => {
    const P = partyLevels.split(",").map(Number);
    if (P.length > 4 || P.length < 1) {
      setError("Parties must have 1 to 4 adventurers");
      return;
    }

    if (P.some((p) => isNaN(p) || p < 1 || p > MAX_LEVEL)) {
      setError("Experience levels must be a number between 1 and " + MAX_LEVEL);
      return;
    }
    setError(null);
    const X = P.sort((a, b) => b - a);
    const N = X.length;
    const A = X.reduce((a, x) => a + x, 0) / N;
    setPartySize(N);
    setRecommendedDungeonTier(Math.ceil((MAX_TIER * A) / MAX_LEVEL));
    setRecommendedDungeonTierWarn(Math.ceil((MAX_TIER * (A + 1)) / MAX_LEVEL));
    setPartyLevelsArray(X);
  }, [
    partyLevels,
    setError,
    setRecommendedDungeonTier,
    setRecommendedDungeonTierWarn,
    setPartyLevelsArray,
    setPartySize,
  ]);

  const results =
    error != null ? (
      <div className="text-red-300">{error}</div>
    ) : (
      <div className="m-5">
        <p>
          For a party of {partySize} adventurer{plural(partySize)} with
          experience level{plural(partySize)} {partyLevelsArray.join(", ")}; the
          recommended dungeon tier would be tier {recommendedDungeonTier}.
        </p>
        {recommendedDungeonTierWarn > recommendedDungeonTier && (
          <p>
            However if the adventurer{possessive(partySize)} XP progress bar
            {plural(partySize)} {preposition(partySize)} full enough the
            recommended tier could be {recommendedDungeonTierWarn};
          </p>
        )}
        <p>
          For a party of {partySize} to be recommended a tier{" "}
          {recommendedDungeonTier} dungeon, the sum total of the experience
          level
          {plural(partySize)} must be less than{" "}
          {Math.round(
            ((partySize * recommendedDungeonTier * MAX_LEVEL) / MAX_TIER) * 100,
          ) / 100}
        </p>
      </div>
    );
  return (
    <div>
      <div className="flex-auto">
        <label htmlFor="partylvls" className="font-bold block mb-2">
          Party Levels
        </label>
        <InputText
          id="partylvls"
          value={partyLevels}
          onChange={(e) => setPartyLevels(e.target.value)}
          tooltip="Enter each character experience level in a comma separated list"
        />
      </div>
      {results}
    </div>
  );
}
