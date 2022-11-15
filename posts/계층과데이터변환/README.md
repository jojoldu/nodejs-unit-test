# 계층과 데이터 변환



```ts
async getLectureByDate (createdAt: Date): Promise<LectureItem> {
    const lectures = await this.nodePgTemplate.queryWith(
        'SELECT * FROM lecture l WHERE l.created_at >= $1',
        [createdAt]
    );

    return transform(lectures[0], LecturesItem);
}
```

```ts
async getLectureByLocalDate (createdAt: LocalDateTime): Promise<LectureItem> {
    const createdDate = convert(createdAt).toDate();
    const lectures = await this.nodePgTemplate.queryWith(
        'SELECT * FROM lecture l WHERE l.created_at >= $1',
        [createdDate]
    );

    return transform(lectures[0], LecturesItem);
}
```