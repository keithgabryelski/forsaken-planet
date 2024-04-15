const NUM_ATTACKS_PER_DUNGEON = 50;

class Adjustment {
  constructor(chance, multiplier) {
    this.chance = chance;
    this.multiplier = multiplier;
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

class DamageType {
  constructor(name, adjustment) {
    this.name = name;
    this.adjustment = adjustment;
  }

  get title() {
    return this.name + this.adjustment.stats();
  }
}

class Perk {
  constructor(name, adjustment) {
    this.name = name;
    this.adjustment = adjustment;
  }

  get title() {
    return "+" + this.name + this.adjustment.stats();
  }
}

class ArmEXO {
  constructor(name, adjustment) {
    this.name = name;
    this.adjustment = adjustment;
  }

  get title() {
    return this.name + this.adjustment.stats();
  }
}

class Gear {
  constructor(name, damage) {
    this.name = name;
    this.damage = damage;
  }

  get title() {
    return this.name + "#" + this.damage;
  }
}

class Weapon {
  constructor(gear, damage_type, perk1, perk2) {
    this.gear = gear;
    this.damage_type = damage_type;
    this.perk1 = perk1;
    this.perk2 = perk2;
  }

  get title() {
    return [
      this.gear.title(),
      this.damage_type.title(),
      this.perk1.title(),
      this.perk2.title(),
    ].join(" ");
  }
}

class Suit {
  constructor(arm_EXO) {
    this.arm_EXO = arm_EXO;
  }
  get title() {
    return this.arm_EXO.title();
  }
}

class HitResult {
  constructor(
    rnum1,
    rnum2,
    damage,
    chance,
    chanced,
    rolled_damage,
    adjusted_damage,
    multiplier,
  ) {
    this.rnum1 = rnum1;
    this.rnum2 = rnum2;
    this.damage = damage;
    this.chance = chance;
    this.chanced = chanced;
    this.rolled_damage = rolled_damage;
    this.adjusted_damage = adjusted_damage;
    this.multiplier = multiplier;
  }
  attack() {
    return this.adjusted_damage;
  }

  get debugout() {
    return [
      "rnum1:",
      this.rnum1,
      "damage:",
      this.damage,
      "rnum2:",
      this.rnum2,
      "chance:",
      this.chance,
      "chanced:",
      this.chanced,
      "rolled_damage:",
      this.rolled_damage,
      "multiplier:",
      this.multiplier,
      "adjusted_damage:",
      this.adjusted_damage,
    ].join(" ");
  }
}

class Hit {
  constructor(damage, adjustment) {
    this.damage = damage;
    this.adjustment = adjustment;
  }

  adjust(by) {
    let chance = this.adjustment.chance;
    let multiplier = this.adjustment.multiplier;
    let damage = this.damage;
    if (by.chance == 1) {
      damage = damage + (by.multiplier - 1);
    } else {
      chance = chance + by.chance;
      multiplier = multiplier + by.multiplier;
    }

    return new Hit(damage, new Adjustment(chance, multiplier));
  }

  calculate_hit_result() {
    const rnum1 = Math.random();
    const rolled_damage = this.damage * rnum1;
    const rnum2 = Math.random();
    const chanced = rnum2 < this.adjustment.chance;
    let adjusted_damage;
    if (chanced) {
      adjusted_damage = rolled_damage * this.adjustment.multiplier;
    } else {
      adjusted_damage = rolled_damage;
    }
    return new HitResult(
      rnum1,
      this.damage,
      rnum2,
      this.adjustment.chance,
      chanced,
      rolled_damage,
      this.adjustment.multiplier,
      adjusted_damage,
    );
  }
}

class Scenario {
  constructor(weapon, suit) {
    this.weapon = weapon;
    this.suit = suit;
  }

  get title() {
    return [this.weapon.title(), this.suit.title()].join(" ");
  }

  calculateHit() {
    let hit = new Hit(this.weapon.gear.damage, new Adjustment(0.01, 1.0));
    hit = hit.adjust(this.weapon.damage_type.adjustment);
    hit = hit.adjust(this.weapon.perk1.adjustment);
    hit = hit.adjust(this.weapon.perk2.adjustment);
    hit = hit.adjust(this.suit.arm_EXO.adjustment);

    return hit;
  }
}

class Simulator {
  constructor(damage, damageType, perks, exos) {
    this.damage = damage;
    this.damageTye = damageType;
    this.perks = perks;
    this.exos = exos;
  }

  calc(hit) {
    const out = [];
    for (let n = 0; n < NUM_ATTACKS_PER_DUNGEON; ++n) {
      const result = hit.calculate_hit_result();
      const damage = result.attack();
      out.push(damage);
    }
    return out;
  }

  simulate(scenario) {
    const hit = scenario.calculate_hit();
    const out = [];
    for (let n = 0; n < 100; ++n) {
      const calced = this.calc(hit);
      out.push(calced);
    }
  }

  createScenario() {}
}
