import { Container } from "react-bootstrap";
import Calculator from "./models/Calculator";
import { Item } from "./models/Item";

function gcd(a, b) {
  // Take the absolute values of a and b to ensure positivity.
  let x = Math.abs(a);
  let y = Math.abs(b);

  // Iterate using the Euclidean algorithm to find the GCD.
  while (y) {
    // Store the value of y in a temporary variable t.
    let t = y;
    // Calculate the remainder of x divided by y and assign it to y.
    y = x % y;
    // Assign the value of t (previous value of y) to x.
    x = t;
  }
  // Return the GCD, which is stored in x after the loop.
  return x;
}

function DropRate({ selectables }) {
  const { statistics, selected } = selectables;
  const { gearNames, rarities, damageTypes, perks } = selected;
  const { byGroup, byRarity, byDamageType, byPerk } = statistics.stats;
  const calculator = new Calculator();

  const namesDropRate = calculator.dropRate(gearNames, byGroup);
  const raritiesDropRate = calculator.dropRate(rarities, byRarity);
  const damageTypesDropRate = calculator.dropRate(damageTypes, byDamageType);
  const perksDropRate = calculator.dropRate(perks, byPerk);

  const total =
    namesDropRate * raritiesDropRate * damageTypesDropRate * perksDropRate;

  const { percent, humanText } = Item.dropRatePercent(total);

  return (
    <Container fluid>
      ={percent}% ({humanText})
    </Container>
  );
}

export default DropRate;
