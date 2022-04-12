# expect에서 false와 falsy 구분하기

Jest로 테스트 코드를 작성하다보면 습관적으로 IDE의 자동완성으로 `toBeFalsy` 와 `toBeTruthy` 를 사용하곤했다.  
저 둘이 아닌 `toBe(false)` 와 `toBe(true)` 는 한번의 자동완성으로 안되기 때문에 굳이 불편하게 사용하진 않았다.  
  
```ts
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
```
