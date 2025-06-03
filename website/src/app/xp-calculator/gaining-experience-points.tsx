"use client";

import { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { tiers } from "./utils";

export default function GainingExperiencePoints() {
  const [questXP, setQuestXP] = useState(4125);
  const [dungeonTier, setDungeonTier] = useState(6);
  const [recommendedDungeonTier, setRecommendedDungeonTier] = useState(7);
  useState(7);
  const [killsXP, setKillsXP] = useState(168);
  const [goldCollected, setGoldCollected] = useState(1344);
  const [chestsOpened, setChestsOpened] = useState(9);
  const [containersBroken, setContainersBroken] = useState(80);
  const [tentaclesExposed, setTentaclesExposed] = useState(0);
  const [XPQ, setXPQ] = useState(0);
  const [XPP, setXPP] = useState(0);
  const [XPB, setXPB] = useState(0);

  useEffect(() => {
    const T = Number(dungeonTier);
    const Trec = Number(recommendedDungeonTier);
    const xpQ = Number(questXP);
    const K = Number(killsXP);
    const B = Number(containersBroken);
    const G = Number(goldCollected);
    const C = Number(chestsOpened);
    const S = Number(tentaclesExposed);
    const sig = [0, 0.15, 0.25, 0.5, 0.75, 1.0, 1.25];
    const dT = Math.max(T - Trec, 0);
    const xpP = 10 * K + 4 * B + 150 * C + Math.floor(G / 2) + 4 * S;
    const xpB = Math.floor(sig[dT] * (xpQ + xpP));

    setXPQ(xpQ);
    setXPP(xpP);
    setXPB(xpB);
  }, [
    questXP,
    dungeonTier,
    recommendedDungeonTier,
    killsXP,
    goldCollected,
    chestsOpened,
    containersBroken,
    tentaclesExposed,
    setXPQ,
    setXPP,
    setXPB,
  ]);

  return (
    <div>
      <div className="grid">
        <div className="col-2">
          <label htmlFor="dungeon-tier" className="font-bold block mb-2">
            Dungeon Tier
          </label>
        </div>
        <div className="col-6">
          <Dropdown
            id="dungeon-ier"
            value={dungeonTier}
            onChange={(e) => setDungeonTier(e.value)}
            options={tiers}
            optionLabel="name"
            placeholder="Select Dungeon Tier"
          />
        </div>
      </div>
      <div className="grid">
        <div className="col-2">
          <label
            htmlFor="recommended-dungeon-tier"
            className="font-bold block mb-2"
          >
            Recommended Dungeon Tier
          </label>
        </div>
        <div className="col-6">
          <Dropdown
            id="recommended-dungeon-tier"
            value={recommendedDungeonTier}
            onChange={(e) => setRecommendedDungeonTier(e.value)}
            options={tiers}
            optionLabel="name"
            placeholder="Select Recommended Dungeon Tier"
          />
        </div>
      </div>
      <div className="grid">
        <div className="col-2">
          <label htmlFor="quest-xp" className="font-bold block mb-2">
            Quest XP
          </label>
        </div>
        <div className="col-6">
          <InputNumber
            inputId="quest-xp"
            value={questXP}
            onValueChange={(e) => setQuestXP(e.value)}
          />
        </div>
      </div>
      <h3>Performance XP</h3>
      <div className="grid">
        <div className="col-2">
          <label htmlFor="killsxp" className="font-bold block mb-2">
            Kills
          </label>
        </div>
        <div className="col-6">
          <InputNumber
            inputId="killsxp"
            value={killsXP}
            onValueChange={(e) => setKillsXP(e.value)}
          />
        </div>
      </div>
      <div className="grid">
        <div className="col-2">
          <label htmlFor="gold-collected" className="font-bold block mb-2">
            Gold Collected
          </label>
        </div>
        <div className="col-6">
          <InputNumber
            inputId="gold-collected"
            value={goldCollected}
            onValueChange={(e) => setGoldCollected(e.value)}
          />
        </div>
      </div>
      <div className="grid">
        <div className="col-2">
          <label htmlFor="chests-opened" className="font-bold block mb-2">
            Chests Opened
          </label>
        </div>
        <div className="col-6">
          <InputNumber
            inputId="chests-opened"
            value={chestsOpened}
            onValueChange={(e) => setChestsOpened(e.value)}
          />
        </div>
      </div>
      <div className="grid">
        <div className="col-2">
          <label htmlFor="containers-broken" className="font-bold block mb-2">
            Containers Broken
          </label>
        </div>
        <div className="col-6">
          <InputNumber
            inputId="containers-broken"
            value={containersBroken}
            onValueChange={(e) => setContainersBroken(e.value)}
          />
        </div>
      </div>
      <div className="grid">
        <div className="col-2">
          <label htmlFor="tentacles-exposed" className="font-bold block mb-2">
            Tentacles Exposed
          </label>
        </div>
        <div className="col-6">
          <InputNumber
            inputId="tentacles-exposed"
            value={tentaclesExposed}
            onValueChange={(e) => setTentaclesExposed(e.value)}
          />
        </div>
      </div>
      <h3>Results:</h3>
      <table border={1}>
        <tbody>
          <tr>
            <th>Name</th>
            <th>XP Gained</th>
            <th>Totals</th>
          </tr>
          <tr>
            <th>Quest XP</th>
            <td>{XPQ}</td>
          </tr>
          <tr>
            <th>Performance XP</th>
            <td>{XPP}</td>
          </tr>
          <tr>
            <th>Bonus XP</th>
            <td>{XPB}</td>
          </tr>
          <tr>
            <th>SUCCESS</th>
            <td>&nbsp;</td>
            <td>{XPQ + XPP + XPB}</td>
          </tr>
          <tr>
            <th>FAILURE</th>
            <td>&nbsp;</td>
            <td>{Math.floor(XPQ / 4) + XPP + 0 * XPB}</td>
          </tr>
        </tbody>
      </table>
      <h3>Notes:</h3>
      <ul>
        <li>The Quest XP is listed as Base XP on the dungeon display table.</li>
        <li>
          The Chests Opened count includes all <b>mimics</b>, <b>bomb chests</b>{" "}
          & unclaimed treasure chests.
        </li>
        <li>
          The kills count does <b>NOT</b> include mimics, and is equal to the
          sum of the party&quot;s wrist kill counters.
        </li>
        <li>
          The gold collected count includes gold obtained from chests, and is
          equal to the sum of the party&quot;s gold collected counters. The
          number is listed as <b>Gold Looted</b> on the dungeon results end
          screen.
        </li>
      </ul>
      <ul>
        <b>To be verified:</b>
        <li>Reaper: + 4 xp ?</li>
        <li>whistle: + 0 xp ?</li>
        <li>map: 0 xp ?</li>
        <li>skeleton key find/operate: + 0 xp ?</li>
        <li>
          dungeon levers: + 0 xp <i>VERIFIED!</i>
        </li>
        <li>unlocking side doors: + 0 xp ?</li>
        <li>
          miniboss fight: + 150 per bomb chest only! <i>VERIFIED!</i>{" "}
        </li>
      </ul>
    </div>
  );
}
