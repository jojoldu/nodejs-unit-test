describe('toBe(true)와 toBe(b)', () => {
  describe('등호', () => {
    it('getCount의 결과는 5보다 크다', () => {
      const result = getCount();

      expect(result > 5).toBe(true);
    });

    it('getCount의 결과는 5보다 크다', () => {
      const result = getCount();

      expect(result).toBeGreaterThan(5);
    });

  });

  describe('테스트 성공', () => {
    it('getCount의 값은 10과 동일하다', () => {
      const count = getCount();

      expect(count === 10).toBe(true);
    });

    it('getCount의 값은 10이다', () => {
      const count = getCount();

      expect(count).toBe(10);
    });
  });

  describe('테스트 실패', () => {
    it('toBe(true)', () => {
      const count = getCount();

      expect(count === 20).toBe(true);
    });

    it('toBe(b)', () => {
      const count = getCount();

      expect(count).toBe(20);
    });
  });

});

function getCount() {
  return 10;
}
