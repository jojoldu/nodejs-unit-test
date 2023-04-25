# 특수 사례 패턴 (Special Case Pattern)

```ts
const employees = getEmployees();
if(employees !== null) {
  for(const employee of employees) {
    totalPay += employee.getPay();
  }
}
```

기본적으로 `getEmployees();` 에서 **빈 배열을 반환**하도록 하면 처리가 된다.

```ts
const employees = getEmployees();
for(const employee of employees) {
  totalPay += employee.getPay();
}
```

## 참고자료

- [자바에서 null을 안전하게 다루는 방법](https://www.slideshare.net/gyumee/null-142590829)