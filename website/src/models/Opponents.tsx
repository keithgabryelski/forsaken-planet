export type OpponentIdentityType =
  | "undead"
  | "monster"
  | "critter"
  | "sorcerer"
  | "elemental"
  | "elite";

export const OpponentIdentities: OpponentIdentityType[] = [
  "undead",
  "monster",
  "critter",
  "sorcerer",
  "elemental",
  "elite",
];

export const Opponents = {
  Skeleton: {
    identifiesAs: ["undead"],
    canBe: [["physical", "ice", "fire", "poison"]],
  },
  "Mage Skeleton": {
    identifiesAs: ["undead", "sorcerer"],
    canBe: [["physical", "ice", "fire", "poison"]],
  },
  Zombie: {
    identifiesAs: ["undead"],
    canBe: [["physical", "ice", "fire", "poison"]],
  },
  Spider: { identifiesAs: ["critter"], canBe: [["physical", "ice"], "sizes"] },
  "Flying Bug": {
    identifiesAs: ["critter"],
    canBe: [["physical", "fire"], "sizes"],
  },
  "Flying Head": { identifiesAs: ["monster"], canBe: ["fire"] },
  Bats: { identifiesAs: ["critter"], canBe: ["physical", "ice"] },
  Scorpions: {
    identifiesAs: ["critter"],
    canBe: [["physical", "poison"], "sizes"],
  },
  Slime: { identifiesAs: ["critter"], canBe: ["physical", "ice"] },
  "Blind Octoculus": {
    identifiesAs: ["monster"],
    canBe: [["physical", "ice", "fire", "poison"]],
  },
  "Octo Oculus": {
    identifiesAs: ["monster", "elite"],
    canBe: [["physical", "ice", "fire", "poison"]],
  },
  "Giant Scorpion": {
    identifiesAs: ["monster", "elite"],
    canBe: [["physical", "ice", "fire", "poison"]],
  },
  "Giant Wasp": {
    identifiesAs: ["monster", "elite"],
    canBe: [["physical", "ice", "fire", "poison"]],
  },
  Summoner: {
    identifiesAs: ["sorcerer", "elite"],
    canBe: [["physical", "ice", "fire", "poison"]],
  },
  "Skeletal Knight": {
    identifiesAs: ["undead", "elite"],
    canBe: [["physical", "ice", "fire", "poison"]],
  },
  Golem: {
    identifiesAs: ["monster", "elite"],
    canBe: [["physical", "ice", "fire", "poison"]],
  },
  "Hall Guardian": { identifiesAs: ["sorcerer", "elite"] },
  Imp: {
    identifiesAs: ["monster"],
    canBe: [["physical", "ice", "fire", "poison"]],
  },
};
