export type AttackStyleType = "thrown" | "melee" | "arrow" | "stab";

export const AttackStyles = {
  thrown: {
    exo: ["might"],
    perk: ["throw damage"],
  },
  melee: {
    exo: ["power", "critical"],
  },
  arrow: {
    exo: ["pullback", "impale"],
  },
  stab: {
    exo: ["pierce"],
    perk: ["stab damage"],
  },
};
