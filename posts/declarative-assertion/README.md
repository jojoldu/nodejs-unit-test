# 선언형으로 단언문 작성하기

테스트 코드에서 여러 코드를 리팩토링하더라도, 단언문에 대한 언급은 상대적으로 적다.  
그러나, 단언문은 테스트 코드의 가독성과 유지보수성에 큰 영향을 미친다.  
테스트 코드를 검증하는 단언문을 작성할때 **선언형으로 작성하는 것이 좋다**.  

조건부 로직으로 가득 찬 명령형 코드를 작성할 때 해당 테스트 코드를 보는 개발자들은 더 많은 코드를 읽어야하며 해석을 하는데 더 많은 시간을 사용하게 된다.
반면, 선언형으로 작성하면 해당 테스트 코드를 보는 개발자들은 더 적은 코드를 읽어도 되며 해석하는데 더 적은 시간을 사용하게 된다.  

선언형 프로그래밍의 여러 장점 중, 테스트 코드에 적용할 수 있는 장점은 다음과 같다.  

- 가독성
  - 프로그램이 무엇을 하는지에 중점을 둠으로써, 코드의 의도가 명확하게 드러난다.
- 추상화 
  - 선언형 프로그래밍은 높은 수준의 추상화를 제공한다. 
  - 이를 통해 복잡한 로직을 단순화하고, 문제의 본질에 집중할 수 있게 된다.
  
가능하면 선언형 단언 라이브러리를 활용해서 인간과 유사한 언어, 선언적 BDD 스타일로 기대치를 코딩한다.  
JVM의 Junit, JS/TS의 Jest 등의 테스트 프레임워크에서는 최소한의 선언형 단언형 문법을 제공하고 있다.    
만약 이들로 부족하다면 JVM에서는 [assertJ](https://joel-costigliola.github.io/assertj/) 가 있으며, JS/TS 에서는 [Chai](https://www.chaijs.com/) 가 있으니 이들을 활용한다.

## 예제

```ts
test("When asking for an admin, ensure only ordered admins in results", () => {
  //assuming we've added here two admins "admin1", "admin2" and "user1"
  const allAdmins = getUsers({adminOnly: true});

  let admin1Found,
    adming2Found = false;

  allAdmins.forEach(aSingleUser => {
    if (aSingleUser === "user1") {
      assert.notEqual(aSingleUser, "user1", "A user was found and not admin");
    }
    if (aSingleUser === "admin1") {
      admin1Found = true;
    }
    if (aSingleUser === "admin2") {
      admin2Found = true;
    }
  });

  if (!admin1Found || !admin2Found) {
    throw new Error("Not all admins were returned");
  }
});
```

```ts
it("When asking for an admin, ensure only ordered admins in results", () => {
  //assuming we've added here two admins
  const allAdmins = getUsers({adminOnly: true});

  expect(allAdmins)
    .to.include.ordered.members(["admin1", "admin2"])
    .but.not.include.ordered.members(["user1"]);
});
```