export function getPremiumFactor(age: number): number {
    if(age >= 60) {
      return 1.35;
    }

    if(age >= 24 && age < 60) {
      return 1;
    }

    if(age >= 18 && age < 24) {
      return 1.75;
    }
}