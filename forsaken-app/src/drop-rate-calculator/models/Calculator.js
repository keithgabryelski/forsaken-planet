export default class Calculator {
  dropRate(selected, statsIndex) {
    if (selected.length === 0) {
      return 1.0;
    }

    const dropRate = selected.reduce((accumulator, gearName) => {
      return accumulator + statsIndex.get(gearName);
    }, 0.0);
    return dropRate;
  }
}
