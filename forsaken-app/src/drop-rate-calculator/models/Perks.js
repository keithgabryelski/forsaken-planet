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
