# 선언적 스타일의 단언문 사용하기

선언적 스타일로 테스트를 코딩하면 독자가 뇌-CPU 주기를 한 번도 소비하지 않고도 즉시 파악할 수 있다.  
조건부 논리로 가득 찬 명령형 코드를 작성할 때 독자는 더 많은 뇌-CPU 주기를 발휘해야 한다.  
이 경우 사용자 지정 코드를 사용 expect하거나 should사용하지 않고 인간과 유사한 언어, 선언적 BDD 스타일로 기대치를 코딩한다.  
Chai & Jest에 원하는 어설션이 포함되어 있지 않고 반복 가능성이 높은 경우 Jest 매처(Jest)를 확장하거나 사용자 지정 Chai 플러그인 작성 을 고려해야한다.

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