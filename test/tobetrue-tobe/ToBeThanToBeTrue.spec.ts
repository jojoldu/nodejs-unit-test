
describe('toBe(true)와 toBe(b)', () => {
  describe('테스트 성공', () => {
    it('toBe(true)', () => {
      const count = getCount();

      expect(count === 10).toBe(true);
    });

    it('toBe(b)', () => {
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
