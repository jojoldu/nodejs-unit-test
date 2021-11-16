# 반복문(For문)을 통한 단언 (assert / expect) 금지

```javascript
it('ids에 값이 두 개 이상인 경우', async () => {
  const dto = plainToClass(RecentlyViewedPositionsDto, { ids: '[1,2,3]' });
  const result = await positionsB2cService.recentlyViewedPositions(dto);
  expect(result.length).toBe(3);
  result.forEach((position, index) => {
    expect(position.id).toBe(index + 1);
  });
});
```
