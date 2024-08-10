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
export const twoHandedSwordPerks = [
  "knockback distance",
  "vampire",
  "unblockable",
  "stab damage",
];

export const gearPerksMatrix = {
  axes: [...axePerks, ...weaponPerks],
  bows: [...bowPerks, ...weaponPerks],
  crossbows: [...crossbowPerks, ...weaponPerks],
  daggers: [...daggerPerks, ...weaponPerks],
  hammers: [...hammerPerks, ...weaponPerks],
  shields: [...shieldPerks, ...weaponPerks],
  staves: [],
  swords: [...swordPerks, ...weaponPerks],
  "two-handed": [...twoHandedSwordPerks, ...weaponPerks],
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
  ...twoHandedSwordPerks,
]);

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
  "attack power": {
    description: "Increases damage by 5-35%",
    type: "weapons",
    "min chance": 1.0,
    "min multiplier": 1.05,
    "max chance": 1.0,
    "max multiplier": 1.35,
  },
  criticals: {
    description: "Gives 20-32% chance to critically strike for 300% damage",
    type: "weapons",
    "min chance": 0.2,
    "min multiplier": 3,
    "max chance": 0.32,
    "max multiplier": 3,
  },
  "undead damage": {
    description: "Increases damage by 5-35% to undead enemies",
    type: "weapons",
    "min chance": 1.0,
    "min multiplier": 1.05,
    "max chance": 1.0,
    "max multiplier": 1.35,
    limitsEffectToEnemy: "undead",
  },
  "monster damage": {
    description: "Increases damage by 5-35% to monsters",
    type: "weapons",
    "min chance": 1.0,
    "min multiplier": 1.05,
    "max chance": 1.0,
    "max multiplier": 1.35,
    limitsEffectToEnemy: "monster",
  },
  "critter damage": {
    description: "Increases damage by 5-35% to critters",
    type: "weapons",
    "min chance": 1.0,
    "min multiplier": 1.05,
    "max chance": 1.0,
    "max multiplier": 1.35,
    limitsEffectToEnemy: "critter",
  },
  "sorcerer damage": {
    description: "Increases damage by 5-35% to sorcerer enemies",
    type: "weapons",
    "min chance": 1.0,
    "min multiplier": 1.05,
    "max chance": 1.0,
    "max multiplier": 1.35,
    limitsEffectToEnemy: "sorcerer",
  },
  "elemental damage": {
    description: "Increases damage by 5-35% to elemental enemies",
    type: "weapons",
    "min chance": 1.0,
    "min multiplier": 1.05,
    "max chance": 1.0,
    "max multiplier": 1.35,
    limitsEffectToEnemy: "elemental",
  },
  "elite damage": {
    description: "Increases damage by 5-35% to elite enemies",
    type: "weapons",
    "min chance": 1.0,
    "min multiplier": 1.05,
    "max chance": 1.0,
    "max multiplier": 1.35,
    limitsEffectToEnemy: "elite",
  },
  "throw distance": {
    description: "Increases throwing range by 10-70%",
    type: "hammers",
    "min chance": "",
    "min multiplier": "",
    "max chance": "",
    "max multiplier": "",
  },
  "throw damage": {
    description: "Increases throwing damage by 5-35%",
    type: "axes",
    "min chance": 1.0,
    "min multiplier": 1.05,
    "max chance": 1.0,
    "max multiplier": 1.35,
    limitsEffectToAttackStyle: "thrown",
  },
  explosions: {
    description: "Gives 20-32% chance to explode for 200% damage",
    type: "axes",
    "min chance": 0.2,
    "min multiplier": 2,
    "max chance": 0.32,
    "max multiplier": 2,
  },
  slowing: {
    description: "Gives 20-32% chance to slow enemy",
    type: "hammers",
    "min chance": "",
    "min multiplier": "",
    "max chance": "",
    "max multiplier": "",
  },
  reload: {
    description: "Gives 1-7 extra shots per reload",
    type: "crossbows",
    "min chance": "",
    "min multiplier": "",
    "max chance": "",
    "max multiplier": "",
  },
  "shot distance": {
    description: "Increases shooting range by 10-70%",
    type: "bows",
    "min chance": "",
    "min multiplier": "",
    "max chance": "",
    "max multiplier": "",
  },
  vampire: {
    description: "Gives 20-32% chance to heal 25% of player health",
    type: "swords",
    "min chance": "",
    "min multiplier": "",
    "max chance": "",
    "max multiplier": "",
  },
  poison: {
    description: "Gives 20-32% chance to poison enemy",
    type: "daggers",
    "min chance": "",
    "min multiplier": "",
    "max chance": "",
    "max multiplier": "",
  },
  "area damage": {
    description: "Gives 20-32% chance to explode for 200% damage",
    type: "hammers",
    "min chance": 0.2,
    "min multiplier": 2,
    "max chance": 0.32,
    "max multiplier": 2,
  },
  "knockback distance": {
    description: "Knockback distance increases shield knockback by 10-70%",
    type: "shields",
    "min chance": "",
    "min multiplier": "",
    "max chance": "",
    "max multiplier": "",
  },
  absorb: {
    description: "Heals 4-29% of player health when blocking",
    type: "shields",
    "min chance": "",
    "min multiplier": "",
    "max chance": "",
    "max multiplier": "",
  },
  throwable: {
    description: "Allows sword to be thrown",
    type: "swords",
    "min chance": "",
    "min multiplier": "",
    "max chance": "",
    "max multiplier": "",
  },
  unblockable: {
    description: "Attacks can not be blocked/parried by enemies",
    type: "two-handed",
    "min chance": "",
    "min multiplier": "",
    "max chance": "",
    "max multiplier": "",
  },
  "stab damage": {
    description: "Increases damage by 50%",
    type: "swords",
    "min chance": 1.0,
    "min multiplier": 1.5,
    "max chance": 1.0,
    "max multiplier": 1.5,
    limitsEffectToAttackStyle: "stab",
  },
};
