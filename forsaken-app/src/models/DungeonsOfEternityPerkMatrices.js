export const gearDamageTypesMaxtrix = {
  axes: ["ice", "fire", "poison", "physical"],
  bows: ["ice", "fire", "poison", "physical"],
  crossbows: ["ice", "fire", "poison", "physical"],
  daggers: ["ice", "fire", "poison", "physical"],
  hammers: ["ice", "fire", "poison", "physical"],
  shields: [],
  staves: [],
  swords: ["ice", "fire", "poison", "physical"],
};

export const weaponPerks = [
  "attack power",
  "criticals",
  "undead damage",
  "monster damage",
  "critter damage",
  "sorcerer damage",
  "elemental damage",
  "elite damage",
];

export const axePerks = ["throw distance", "throw damage", "explosions"];
export const bowPerks = ["shot distance", "slowing"];
export const crossbowPerks = ["slowing", "reload"];
export const daggerPerks = ["throw distance", "vampire", "poison"];
export const hammerPerks = ["throw distance", "slowing", "area damage"];
export const shieldPerks = ["knockback distance", "absorb"];
export const swordPerks = ["vampire", "throwable", "stab damage"];

export const gearPerksMatrix = {
  axes: [...axePerks, ...weaponPerks],
  bows: [...bowPerks, ...weaponPerks],
  crossbows: [...crossbowPerks, ...weaponPerks],
  daggers: [...daggerPerks, ...weaponPerks],
  hammers: [...hammerPerks, ...weaponPerks],
  shields: [...shieldPerks, ...weaponPerks],
  staves: [],
  swords: [...swordPerks, ...weaponPerks],
};

export const perkSet = new Set([
  ...weaponPerks,
  ...axePerks,
  ...bowPerks,
  ...crossbowPerks,
  ...daggerPerks,
  ...hammerPerks,
  ...shieldPerks,
  ...swordPerks,
]);

export const gearSlotPlacement = {
  axes: "hip",
  bows: "back",
  crossbows: "back",
  daggers: "hip",
  hammers: "hip",
  shields: "back",
  staves: "back",
  swords: "hip",
};

export const perkGearMatrix = Object.entries(gearPerksMatrix).reduce(
  (accumulator, item) => {
    const [gearName, perkNames] = item;
    const newStuff = perkNames.reduce((acc, perkname) => {
      acc[perkname] = gearName;
      return acc;
    }, {});
    for (const [g, ps] of Object.entries(newStuff)) {
      accumulator[g] = (accumulator[g] ?? []).concat(ps);
    }
    return accumulator;
  },
  {},
);

export const perkDescriptions = {
  "attack power": "Increases damage by 5-30%",
  criticals: "Gives 20-30% chance to critically strike for 300% damage",
  "undead damage": "Increases damage by 5-30% to undead enemies",
  "monster damage": "Increases damage by 5-30% to monsters",
  "critter damage": "Increases damage by 5-30% to critters",
  "sorcerer damage": "Increases damage by 5-30% to sorcerer enemies",
  "elemental damage": "Increases damage by 5-30% to elemental enemies",
  "elite damage": "Increases damage by 5-30% to elite enemies",
  "throw distance": "Increases throwing range by 10-60%",
  "throw damage": "Increases throwing damage by 5-30%",
  explosions: "Gives 20-30% chance to explode for 200% damage",
  slowing: "Gives 20-30% chance to slow enemy",
  reload: "Gives 1-6 extra shots per reload",
  "shot distance": "Increases shooting range by 10-60%",
  vampire: "Gives 20-30% chance to heal 25% of player health",
  poison: "Gives 20-30% chance to poison enemy",
  "area damage": "Gives 20-30% chance to explode for 200% damage",
  "knockback distance":
    "Knockback distance increases shield knockback by 10-60%",
  absorb: "Heals 4-25% of player health when blocking",
  throwable: "Allows sword to be thrown",
  "stab damage": "Increases damage by 50%",
};

export const damageTypeDescriptions = {
  ice: "chance to freeze and cause embrittlement: frozen targets receive extra damage",
  fire: "chance to explode for 200% damage",
  poison: "chance to stun target for a few seconds",
  physical: "no additional effect",
};
