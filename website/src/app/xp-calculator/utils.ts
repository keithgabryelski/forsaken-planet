export const MAX_LEVEL = 60;
export const MAX_TIER = 7;

export const tiers = [
  { name: "Tier 1", code: "1" },
  { name: "Tier 2", code: "2" },
  { name: "Tier 3", code: "3" },
  { name: "Tier 4", code: "4" },
  { name: "Tier 5", code: "5" },
  { name: "Tier 6", code: "6" },
  { name: "Tier 7", code: "7" },
];

export function plural(n) {
  return n === 1 ? "" : "s";
}
export function possessive(n) {
  return n === 1 ? "'s" : "s'";
}
export function preposition(n) {
  return n === 1 ? "is" : "are";
}
