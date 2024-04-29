import { AttackStyles } from "@/models/AttackStyles";
import { damageTypeDescriptions } from "@/models/DamageTypes";
import { perkDescriptions } from "@/models/Perks";
import { exoDescriptions } from "@/models/EXOs";
import { type Selectables } from "./SimulatorSelectables";

const NUM_ATTACKS_TO_NORMALIZE = 1000;
const NUM_ATTACKS_PER_DUNGEON = 100;

class Actor {
  name: string;
  description: string;

  constructor(name: string, description: string = null) {
    this.name = name;
    this.description = description;
  }
}

type LimitTypes = "attack-style" | "enemy";

class EffectLimit extends Actor {
  limitType: LimitTypes;
  limitName: string;

  constructor(
    name: string,
    description: string,
    limitType: LimitTypes,
    limitName: string,
  ) {
    super(name, description);
    this.limitType = limitType;
    this.limitName = limitName;
  }
}

class Adjustment extends Actor {
  chance: number;
  multiplier: number;
  limitTo: EffectLimit;

  constructor(
    name: string,
    description: string,
    chance: number,
    multiplier: number,
    limitTo: EffectLimit,
  ) {
    super(name, description);
    this.chance = chance;
    this.multiplier = multiplier;
    this.limitTo = limitTo;
  }

  buffsWhen(enemy: Enemy, _attackStyle: AttackStyle): boolean {
    if (this.limitTo == null) {
      // no limiting parameter
      return true;
    }
    switch (this.limitTo?.limitType) {
      case "enemy":
        return enemy.identifiesAsEnemyType(this.limitTo.limitName);

      default:
        return true;
    }
  }
}

class Enemy extends Actor {
  enemyTypes: string[];

  constructor(name: string, description: string, enemyTypes: string[]) {
    super(name, description);
    this.enemyTypes = enemyTypes;
  }

  identifiesAsEnemyType(enemyType: string): boolean {
    return this.enemyTypes.some((et: string) => et === enemyType);
  }

  static Factory(identities: string[]): Enemy {
    return new Enemy("generic", "generic", identities);
  }
}

class AttackStyle extends Actor {
  exoNames: string[];
  perkNames: string[];

  constructor(
    name: string,
    description: string,
    exoNames: string[],
    perkNames: string[],
  ) {
    super(name, description);
    this.exoNames = exoNames;
    this.perkNames = perkNames;
  }

  buffedByEXO(exoName: string): boolean {
    return this.name === exoName;
  }

  buffedByPerk(perkName: string): boolean {
    return this.perkNames.some((pn: string) => pn === perkName);
  }

  static Factory(name: string): AttackStyle {
    let exo = [];
    let perk = [];
    try {
      const attackStyle = AttackStyles[name];
      exo = attackStyle.exo || [];
      perk = attackStyle.perk || [];
    } catch (_e) {
      throw new Error(`Invalid attackStyle name: "${name || ""}"`);
    }
    return new AttackStyle(name, name, exo, perk);
  }
}

class DamageType extends Adjustment {
  static Factory(name: string): DamageType {
    const damageType = damageTypeDescriptions[name];
    if (!damageType) {
      throw new Error(`Invalid damageType: "${name || ""}"`);
    }
    return new DamageType(
      name,
      damageType.description,
      damageType.chance || 0.0,
      damageType.multiplier || 1.0,
    );
  }
}

class Perk extends Adjustment {
  buffsWhen(enemy: Enemy, attackStyle: AttackStyle): boolean {
    if (!super.buffsWhen(enemy, attackStyle)) {
      return false;
    }
    if (this.limitTo?.limitType === "attack-style") {
      return attackStyle.buffedByPerk(this.limitTo.limitName);
    }

    return true;
  }

  static Factory(name: string): DamageType {
    if (!name) {
      return null;
    }
    const perkDescription = perkDescriptions[name];
    if (!perkDescription) {
      throw new Error(`Invalid perk: ${name}`);
    }
    let limit = null;
    if (perkDescription.limitsEffectToEnemy) {
      limit = new EffectLimit(
        "perk",
        name,
        "enemy",
        perkDescription.limitsEffectToEnemy,
      );
    } else if (perkDescription.limitsEffectToAttackStyle) {
      limit = new EffectLimit(
        "perk",
        name,
        "attack-style",
        perkDescription.limitsEffectToAttackStyle,
      );
    }
    return new Perk(
      name,
      perkDescription.description,
      perkDescription["max chance"] || 0.0,
      perkDescription["max multiplier"] || 1.0,
      limit,
    );
  }
}

class Exo extends Adjustment {
  buffsWhen(enemy: Enemy, attackStyle: AttackStyle): boolean {
    if (!super.buffsWhen(enemy, attackStyle)) {
      return false;
    }
    if (this.limitTo?.limitType === "attack-style") {
      return attackStyle.buffedByEXO(this.limitTo.limitName);
    }

    return true;
  }

  static Factory(name: string): Exo {
    if (!name) {
      return null;
    }
    const exoDescription = exoDescriptions[name];
    if (!exoDescription) {
      throw new Error(`Invalid EXO: ${name}`);
    }
    let limit = null;
    if (exoDescription.limitsEffectToEnemy) {
      limit = new EffectLimit(
        "exo",
        name,
        "enemy",
        exoDescription.limitsEffectToEnemy,
      );
    } else if (exoDescription.limitsEffectToAttackStyle) {
      limit = new EffectLimit(
        "exo",
        name,
        "attack-style",
        exoDescription.limitsEffectToAttackStyle,
      );
    }

    return new Exo(
      name,
      exoDescription.description,
      exoDescription["max chance"] || 0.0,
      exoDescription["max multiplier"] || 1.0,
      limit,
    );
  }
}

class Gear extends Actor {
  damage: number;

  constructor(name: string, damage: number) {
    super(name, name);
    this.damage = damage;
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
    return this.procs.reduce((accumulator, proc) => {
      if (proc.didOccur) {
        return accumulator + this.baseDamage * proc.damageScale;
      }
      return accumulator;
    }, 0.0);
  }

  get totalDamageDone(): number {
    return this.baseDamage + this.damageAdjustmentScale;
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
    const doesAdjustment = this.fromAdjustment.buffsWhen(
      this.enemy,
      this.attackStyle,
    );
    if (doesAdjustment) {
      return this.fromAdjustment.multiplier;
    }
    return 0;
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

  get baseHitDamage(): number {
    return this.damage;
  }

  rolls(enemy: Enemy, attackStyle: AttackStyle): ProgrammedRandomOccurrence[] {
    return this.adjustments.map(
      (adjustment) =>
        new ProgrammedRandomOccurrence(adjustment, enemy, attackStyle),
    );
  }

  calculateHitResult(enemy: Enemy, attackStyle: AttackStyle): HitResult {
    const rolls = this.rolls(enemy, attackStyle);
    return new HitResult(this, this.baseHitDamage, rolls);
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

  getAdjustments(): Adjustment[] {
    return [
      ...this.weapon.getAdjustments(),
      ...(this.suit?.getAdjustments() || []),
    ];
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
    const gear = Gear.Factory("generic", selected.damage);
    const damageType = DamageType.Factory(selected.damageTypeName.name);
    const perk1 =
      (selected.perk1Name && Perk.Factory(selected.perk1Name.name)) || null;
    const perk2 =
      (selected.perk2Name && Perk.Factory(selected.perk2Name.name)) || null;
    const weapon = Weapon.Factory(gear, damageType, perk1, perk2);
    const suit =
      (selected.armEXOName && Suit.Factory(selected.armEXOName.name)) || null;
    const enemy = Enemy.Factory(selected.opponentIdentities.map((o) => o.name));
    const attackStyle = AttackStyle.Factory(selected.attackStyle?.name);
    return new Scenario(weapon, attackStyle, suit, enemy);
  }
}
