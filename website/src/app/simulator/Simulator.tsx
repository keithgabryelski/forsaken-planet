import Opponents from "@/models/Opponents";
import AttackStyles from "@/models/AttackStyles";
import {
  damageTypeDescriptions,
  perkDescriptions,
  exoDescriptions,
} from "@/models/DungeonsOfEternityPerkMatrices";
//import DungeonsOfEternityCache from "@/models/DungeonsOfEternityCache";
import { type Selectables } from "./SimulatorSelectables";

const NUM_ATTACKS_TO_NORMALIZE = 1000;
const NUM_ATTACKS_PER_DUNGEON = 100;

// what's his kname's shuffle
function shuffle(array: number[]): number[] {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

class Actor {
  name: string;

  constructor(name) {
    this.name = name;
  }

  get title(): string {
    return this.name;
  }
}

class Adjustment extends Actor {
  chance: number;
  multiplier: number;

  constructor(name: string, chance: number, multiplier: number) {
    super(name);
    this.chance = chance;
    this.multiplier = multiplier;
  }

  get title() {
    return this.name + this.stats();
  }

  doesAdjustFor(_enemy: Enemy, _attackStyle: AttackStyle): boolean {
    return true;
  }

  get stats() {
    if (this.chance == 0) {
      return "";
    }
    if (this.chance == 1) {
      return "#" + this.multiplier;
    }
    return "#" + this.multiplier + "@" + this.chance;
  }
}

class Enemy extends Actor {
  enemyTypes: string[];

  constructor(name: string, enemyTypes: string[]) {
    super(name);
    this.enemyTypes = enemyTypes;
  }

  // doesAdjustFor(enemy: Enemy, attackStyle: AttackStyle): boolean {
  //  return true;
  // }

  static Factory(name: string): Enemy {
    const enemyTypes = Opponents[name];
    if (!enemyTypes) {
      throw new Error(`Invalid enemy name: ${name}`);
    }
    return new Enemy(name, enemyTypes);
  }
}

class AttackStyle extends Actor {
  exoNames: string[];

  constructor(name: string, exoNames: string[]) {
    super(name);
    this.exoNames = exoNames;
  }

  static Factory(name: string): Enemy {
    const exoNames = AttackStyles[name];
    if (!exoNames) {
      throw new Error(`Invalid attackStyle name: ${name}`);
    }
    return new AttackStyle(name, exoNames);
  }
}

class DamageType extends Adjustment {
  get title() {
    return "++" + super.title();
  }

  doesAdjustFor(_enemy: Enemy, _attackStyle: AttackStyle): boolean {
    return true;
  }

  static Factory(name: string): DamageType {
    const damageType = damageTypeDescriptions[name];
    if (!damageType) {
      throw new Error(`Invalid damageType: "${name}"`);
    }
    return new DamageType(
      name,
      damageType.chance || 0.0,
      damageType.multiplier || 1.0,
    );
  }
}

class Perk extends Adjustment {
  get title() {
    return "+" + super.title();
  }

  // doesAdjustFor(_enemy: Enemy, _attackStyle: AttackStyle): boolean {
  //  return true;
  // }

  static Factory(name: string): DamageType {
    if (!name) {
      return null;
    }
    const perkDescription = perkDescriptions[name];
    if (!perkDescription) {
      throw new Error(`Invalid perk: ${name}`);
    }
    return new Perk(
      name,
      perkDescription["max chance"] || 0.0,
      perkDescription["max multiplier"] || 1.0,
    );
  }
}

class Exo extends Adjustment {
  static Factory(name: string): Exo {
    if (!name) {
      return null;
    }
    const exoDescription = exoDescriptions[name];
    if (!exoDescription) {
      throw new Error(`Invalid EXO: ${name}`);
    }
    return new Exo(
      name,
      exoDescription["max chance"] || 0.0,
      exoDescription["max multiplier"] || 1.0,
    );
  }
}

class Gear {
  name: string;
  damage: number;

  constructor(name: string, damage: number) {
    this.name = name;
    this.damage = damage;
  }

  get title() {
    return this.name + "#" + this.damage;
  }

  static Factory(name: string, damage: number): Gear {
    if (!name) {
      throw new Error(`Invalid Gear Name: "${name}"`);
    }
    return new Gear(name, damage);
  }
}

class Weapon {
  gear: Gear;
  damageType: DamageType;
  perk1: Perk;
  perk2: Perk;

  constructor(gear: Gear, damageType: DamageType, perk1: Perk, perk2: Perk) {
    this.gear = gear;
    this.damageType = damageType;
    this.perk1 = perk1;
    this.perk2 = perk2;
  }

  get damage(): number {
    return this.gear.damage;
  }

  get title() {
    return [
      this.gear.title(),
      this.damageType.title(),
      this.perk1?.title(),
      this.perk2?.title(),
    ]
      .filter(Boolean)
      .join(" ");
  }

  getAdjustments(): Adjustment[] {
    return [this.damageType, this.perk1, this.perk2].filter(Boolean);
  }

  static Factory(
    gear: Gear,
    damageType: DamageType,
    perk1: Perk,
    perk2: Perk,
  ): Weapon {
    if (perk1 != null && perk2 != null && perk1.name === perk2.name) {
      throw new Error(
        `Can't have two of the same perk (${perk1.name}) on a single weapon`,
      );
    }
    return new Weapon(gear, damageType, perk1, perk2);
  }
}

class Suit {
  armEXO: Exo;
  mindEXO: Exo;
  legEXO: Exo;
  chestEXO: Exo;

  constructor(armEXO: Exo, mindEXO: Exo, legEXO: Exo, chestEXO: Exo) {
    this.armEXO = armEXO;
    this.mindEXO = mindEXO;
    this.legEXO = legEXO;
    this.chestEXO = chestEXO;
  }

  get title() {
    return this.armEXO.title();
  }

  getAdjustments(): Adjustment[] {
    return [this.armEXO, this.mindEXO, this.legEXO, this.chestEXO].filter(
      Boolean,
    );
  }

  static Factory(armEXOName): Suit {
    const armEXO = Exo.Factory(armEXOName);
    return new Suit(armEXO);
  }
}

class HitResult {
  hit: Hit;
  baseDamage: number;
  procs: ProgrammedRandomOccurrence[];

  constructor(
    hit: Hit,
    baseDamage: number,
    procs: ProgrammedRandomOccurrence[],
  ) {
    this.hit = hit;
    this.baseDamage = baseDamage;
    this.procs = procs;
  }

  get damageAdjustmentScale(): number {
    // XXX should this pull non-critical adjustments first and
    // XXX add those together, then add criticals together?
    return this.procs.reduce((accumulator, proc) => {
      if (proc.didOccur) {
        return accumulator * proc.damageScale;
      }
      return accumulator;
    }, 1.0);
  }

  get totalDamageDone(): number {
    return this.baseDamage * this.damageAdjustmentScale;
  }
}

class ProgrammedRandomOccurrence {
  roll: number;
  enemy: Enemy;
  attackStyle: AttackStyle;
  fromAdjustment: Adjustment;

  constructor(
    fromAdjustment: Adjustment,
    enemy: Enemy,
    attackStyle: AttackStyle,
    roll: number = Math.random(),
  ) {
    this.fromAdjustment = fromAdjustment;
    this.enemy = enemy;
    this.attackStyle = attackStyle;
    this.roll = roll;
  }

  get damageScale(): number {
    const doesAdjustment = this.fromAdjustment.doesAdjustFor(
      this.enemy,
      this.attackStyle,
    );
    if (doesAdjustment) {
      return this.fromAdjustment.multiplier;
    }
    return 1.0;
  }

  get didOccur(): boolean {
    return this.roll < this.fromAdjustment.chance;
  }
}

class Hit {
  damage: number;
  adjustments: Adjustment[];
  enemy: Enemy;
  attackStyle: AttackStyle;

  constructor(
    damage: number,
    adjustments: Adjustment[],
    enemy: Enemy,
    attackStyle: AttackStyle,
  ) {
    this.damage = damage;
    this.adjustments = adjustments;
    this.enemy = enemy;
    this.attackStyle = attackStyle;
  }

  baseHitDamage(): number {
    // XXX maybe include chance to parry here.
    return this.damage * Math.random();
  }

  rolls(enemy: Enemy, attackStyle: AttackStyle): ProgrammedRandomOccurrence[] {
    return this.adjustments.map(
      (adjustment) =>
        new ProgrammedRandomOccurrence(adjustment, enemy, attackStyle),
    );
  }

  calculateHitResult(enemy: Enemy, attackStyle: AttackStyle): HitResult {
    const rolls = this.rolls(enemy, attackStyle);
    shuffle(rolls);
    return new HitResult(this, this.baseHitDamage(), rolls);
  }
}

class Scenario {
  weapon: Weapon;
  attackStyle: AttackStyle;
  suit: Suit;
  enemy: Enemy;

  constructor(
    weapon: Weapon,
    attackStyle: AttackStyle,
    suit: Suit,
    enemy: Enemy,
  ) {
    this.weapon = weapon;
    this.attackStyle = attackStyle;
    this.suit = suit;
    this.enemy = enemy;
  }

  get title(): string {
    return [
      this.weapon.title(),
      this.suit.title(),
      "against",
      enemy.title(),
      "using",
      this.attackStyle.title(),
    ].join(" ");
  }

  getAdjustments(): Adjustment[] {
    return [...this.weapon.getAdjustments(), ...this.suit.getAdjustments()];
  }

  calculateHit(): Hit {
    return new Hit(
      this.weapon.damage,
      this.getAdjustments(),
      this.enemy,
      this.attackStyle,
    );
  }
}

export class Simulator {
  calc(hit: Hit): number[] {
    const out: number[] = [];
    for (let n = 0; n < NUM_ATTACKS_TO_NORMALIZE; ++n) {
      const result = hit.calculateHitResult(hit.enemy, hit.attackStyle);
      const damage = result.totalDamageDone;
      out.push(damage);
    }
    return out;
  }

  simulate(scenario: Scenario): number[][] {
    const hit: Hit = scenario.calculateHit();
    const out: number[][] = [];
    for (let n = 0; n < NUM_ATTACKS_PER_DUNGEON; ++n) {
      const calced = this.calc(hit);
      out.push(calced);
    }
    return out;
  }

  createScenario(selected: Selectables): Scenario {
    const gear = Gear.Factory(selected.gearName, selected.damage);
    const damageType = DamageType.Factory(selected.damageTypeName);
    const perk1 =
      (selected.perk1Name && Perk.Factory(selected.perk1Name)) || null;
    const perk2 =
      (selected.perk2Name && Perk.Factory(selected.perk2Name)) || null;
    const weapon = Weapon.Factory(gear, damageType, perk1, perk2);
    const suit = Suit.Factory(selected.armEXOName);
    const enemy = Enemy.Factory(selected.enemyName);
    const attackStyle = AttackStyle.Factory(selected.attackStyle);
    return new Scenario(weapon, attackStyle, suit, enemy);
  }
}
