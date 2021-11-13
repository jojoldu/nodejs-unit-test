# 검증 코드는 하드코딩 해야한다.

최근 코드리뷰를 하다가 자주 지적하던 내용 중 하나가 바로 **검증부에 도메인 로직이 추가되는 것**이다.  


```javascript
public void GetPath_Hardcoded()
{
    MyClass target = new MyClass("fields", "that later", "determine", "a folder");
    string expected = "C:\\Output Folder\\fields\\that later\\determine\\a folder";
    string actual = target.GetPath();
    Assert.AreEqual(expected, actual,
        "GetPath should return a full directory path based on its fields.");
}

```

```javascript
public void GetPath_Softcoded()
{
    MyClass target = new MyClass("fields", "that later", "determine", "a folder");
    string expected = "C:\\Output Folder\\" + string.Join("\\", target.Field1, target.Field2, target.Field3, target.Field4);
    string actual = target.GetPath();
    Assert.AreEqual(expected, actual,
        "GetPath should return a full directory path based on its fields.");
}
```

두번째 예제에서는 아래와 같은 경우 버그를 찾지 못한다

```javascript
MyTarget() // constructor
{
   Field1 = Field2 = Field3 = Field4 = "";
}
```

혹은 다음과 같이 `expected` 가 선언된 경우 **결과를 미리 예측가능한가?**

```javascript
string expected = "C:\\Output Folder" + string.Join("\\", target.Field1, target.Field2, target.Field3, target.Field4);
```

조금 극단적인 사례로 간다면 이는 다음과 다를바 없다

```ts
sum(val1, val2) {
  return val1 + val2;
}

....

it('sum 테스트', async () => {
  const val1 = 1;
  const val2 = 2;

  const result = sum(val1, val2);

  expect(result).toBe(val1 + val2);
}
```

이 테스트코드는 의미가 있는 테스트일까?  
**결과는 동일하지만 로직이 다른 코드가 된다면** 이 테스트의 검증문은 어떻게 해야할까??

만약 TDD를 한다고 생각해보자.  
예상 결과를 미리 만들어두고 해야지,
**예상 로직을 미리 만들어두고 하는 것이 아니다**

단위 테스트에서는 검증부를 하드코딩하는것이 좋다.  
