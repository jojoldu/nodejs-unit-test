import { getPremiumFactor } from "../../src/risk-premium/getPremiumFactor";

describe('보험 위험 할증금', () => {
  describe('경계값 검증', () => {
    it('청년 [18, 24) ', () => {
      const age = 18;

      const result = getPremiumFactor(age);

      expect(result).toBe(1.75);
    });

    it('일반 [24, 60) ', () => {
      const age = 24;

      const result = getPremiumFactor(age);

      expect(result).toBe(1);
    });

    it('노년 [60, ~) ', () => {
      const age = 60;

      const result = getPremiumFactor(age);

      expect(result).toBe(1.35);
    });

    it('청소년 [1, 18)', () => {
      const age = 17;

      const result = getPremiumFactor(age);

      expect(result).toBe(0);
    });
  });
});