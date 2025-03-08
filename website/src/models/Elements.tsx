export type ElementType = "ice" | "fire" | "poison" | "physical";

export type AdjustmentType = {
  description: string;
  chance: number;
  multiplier: number;
};

export const gearElementsMaxtrix: { [key: string]: ElementType[] } = {
  axes: ["ice", "fire", "poison", "physical"],
  bows: ["ice", "fire", "poison", "physical"],
  crossbows: ["ice", "fire", "poison", "physical"],
  daggers: ["ice", "fire", "poison", "physical"],
  hammers: ["ice", "fire", "poison", "physical"],
  shields: [],
  staves: [],
  swords: ["ice", "fire", "poison", "physical"],
  longswords: ["ice", "fire", "poison", "physical"],
};

export const elementDescriptions: { [key: string]: AdjustmentType } = {
  ice: {
    description:
      "chance to freeze and cause embrittlement: frozen targets receive extra damage",
    chance: 0.0,
    multiplier: 0.0,
  },
  fire: {
    description: "chance to explode for 200% damage",
    chance: 0.3,
    multiplier: 2,
  },
  poison: {
    description: "chance to stun target for a few seconds",
    chance: 0.0,
    multiplier: 0.0,
  },
  physical: {
    description: "no additional effect",
    chance: 0.0,
    multiplier: 0.0,
  },
};
