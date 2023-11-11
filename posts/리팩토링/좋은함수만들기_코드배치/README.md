# 변수 선언 줄여보기

```ts
export class ProductService {
    async create_1 (createDtos: ProductCreateDto[]) {
        const promiseList = [];
        const results: Product[] = [];
        for(const dto of createDtos) {
            const entity = dto.toEntity(generateId());
            const queryParams = [];

            const query =
            `INSERT INTO product (${ Object.keys(entity) }) `
            + 'VALUES (?, ?, ?, ?, ?, NOW(), NOW() )';

            queryParams.push(
                entity.id,
                entity.name,
                entity.price,
                entity.status,
                entity.description
            );
            promiseList.push(this.dbConnection.query(query, queryParams))
            results.push(entity);
        }

        await Promise.all(promiseList);
        return results;
    }
```

관련 있는 변수들을 근처로 옮긴다.

```ts

```

```ts
export class ProductService {
    ...
    
    async create_2 (createDtos: ProductCreateDto[]) {
        const entites = createDtos.map(dto => dto.toEntity(generateId()));

        await Promise.all(entites.map(entity =>
            this.dbConnection.query(
                `INSERT INTO product (${Object.keys(entity)}) `
                + 'VALUES (?, ?, ?, ?, ?, NOW(), NOW() )',
                [
                    entity.id,
                    entity.name,
                    entity.price,
                    entity.status,
                    entity.description
                ])));

        return entites;
    }
}
```

```ts
export class ProductService {
    ...
    
    async create_3 (createDtos: ProductCreateDto[]) {
        const entites = createDtos.map(dto => dto.toEntity(generateId()));

        await Promise.all(entites.map(entity =>
            this.dbConnection.query(getInsertQuery(entity), getParams(entity))));

        return entites;
    }
}
```

데이터가 1,000건, 10,000건이상인 경우에는 

Go처럼 List Comprehension이 부재한 언어에서는 이를 별도의 함수에서 `for` 를 통해 처리할 수 있다.

