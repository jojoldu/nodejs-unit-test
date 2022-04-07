# toBe(true) 보다는 toBe(b)

```ts
expect(a==b).toBe(true) 보다는 expect(a).toBe(b)
```

비슷한 예로 Java로 한다면

```java
//bad

assertTrue(rowCnt==1)
```

```java
//good

assertThat(rowCnt).is(1)
```
