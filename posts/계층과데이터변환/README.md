# 데이터 변환 계층


> 아직 우리팀의 많은 레거시는 TypeORM, MikrORM 등 ORM을 쓰지 않고 QueryBuilder 를 쓰고 있어 Transform이 매끄럽지 않다.

```ts
async getLectureByDate (createdAt: Date): Promise<LectureItem> {
    const lectures = await this.queryTemplate.queryWith(
        'SELECT * FROM lecture l WHERE l.created_at >= $1',
        [createdAt]
    );

    return transform(lectures[0], LecturesItem);
}
```


```ts
async getLectureByLocalDate (createdAt: LocalDateTime): Promise<LectureItem> {
    const createdDate = convert(createdAt).toDate();
    const lectures = await this.queryTemplate.queryWith(
        'SELECT * FROM lecture l WHERE l.created_at >= $1',
        [createdDate]
    );

    return transform(lectures[0], LecturesItem);
}
```

## Data Transfer Object

```ts
export class LectureSearchDto {
  private _createdAt: LocalDateTime;

  constructor(createdAt: LocalDateTime) {
    this._createdAt = createdAt;
  }

  get createdAt(): Date {
    return convert(this._createdAt).toDate();
  }
}
```

```ts
async getLectureByDto (param: LectureSearchDto): Promise<LectureItem> {
    const lectures = await this.nodePgTemplate.queryWith(
        'SELECT * FROM lecture l WHERE l.created_at >= $1',
        [param.createdAt]
    );

    return transform(lectures[0], LecturesItem);
}
```