describe('toBe(false)와 toBeFalsy() 구분하기', () => {
  it('falsy로 검증하면 0도 통과된다', () => {
    const result = calculate();

    expect(result).toBeFalsy();
  });

  it.each([
    [0],
    [''],
    [false],
    [undefined],
    [null],
  ])("calculate 결과가 %s이면 toBeFalsy 를 통과한다", (calculateResult) => {
    const result = calculate(calculateResult);

    expect(result).toBeFalsy();
  });

  it.skip('toBe(false)로 검증하면 0은 통과되지 못한다', () => {
    const result = calculate(0);

    expect(result).toBe(false);

  });


});

function calculate(result?) {
  return result;
}

function calculate1() {
  return 0;
}

function calculate2() {
  return undefined;
}
