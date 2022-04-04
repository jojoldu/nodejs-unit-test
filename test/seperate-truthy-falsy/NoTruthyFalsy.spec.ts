describe('toBe(false)와 toBeFalsy() 구분하기', () => {
  it('falsy로 검증하면 0도 통과된다', () => {
    const result = calculate();

    expect(result).toBeFalsy();
  });

  it.skip('toBe(false)로 검증하면 0은 통과되지 못한다', () => {
    const result = calculate();

    expect(result).toBe(false);

  });


});

function calculate() {
  return 0;
}

function requestEmpty() {
  return '';
}

function requestFalse() {
  return false;
}