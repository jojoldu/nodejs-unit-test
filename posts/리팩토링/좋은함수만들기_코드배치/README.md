# 변수 선언 줄여보기

```ts
export class ProductService {
    async oldCreates(classes: ClassDto[]): Promise<ClassDto[]> {
        const promiseList = [];
        const results = [];
        for(const classItem of classes) {
            const newClassEntity = classItem.toClassEntity(generateUuid());
            const queryParams = [];
        
            const query = `INSERT INTO ${ CLASS_TABLE_NAME }` +
                `(${ Object.keys(newClassEntity).map(k => convertCamelToSnakeName(k)) }) ` +
                `VALUES ( ${convertUuidToBinParam()}, ${convertUuidToBinParam()}, ${convertUuidToBinParam()}, ?, ?, ?, ?, ?, ?, NOW(), NOW() )`;
        
            queryParams.push(
                newClassEntity.id,
                newClassEntity.categoryId,
                newClassEntity.teacherId,
                newClassEntity.nameHash,
                newClassEntity.name,
                newClassEntity.price,
                newClassEntity.state,
                newClassEntity.isDeleted,
                newClassEntity.description
            );
            promiseList.push(this.dbConnection.query(query, queryParams))
            results.push(ClassDto.fromEntity(newClassEntity));
        }
        
        await Promise.all(promiseList);
        return results;
    };
```

```ts
export class ProductService {
    async creates(classes: ClassDto[]): Promise<ClassDto[]> {
        const classEntities = classes.map(c => c.toClassEntity(generateUuid()));
        
        await Promise.all(classEntities.map(newClassEntity => {
            const query = `INSERT INTO ${CLASS_TABLE_NAME}` +
                `(${Object.keys(newClassEntity).map(k => convertCamelToSnakeName(k))}) ` +
                `VALUES ( ${convertUuidToBinParam()}, ${convertUuidToBinParam()}, ${convertUuidToBinParam()}, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3) )`;

            return this.dbConnection.query(query, [
                newClassEntity.id,
                newClassEntity.categoryId,
                newClassEntity.teacherId,
                newClassEntity.nameHash,
                newClassEntity.name,
                newClassEntity.price,
                newClassEntity.state,
                newClassEntity.isDeleted,
                newClassEntity.description]);
        }))

        return classEntities.map(c => ClassDto.fromEntity(c));
    };
}
```
데이터가 1,000건, 10,000건이상인 경우에는 

Go처럼 List Comprehension이 부재한 언어에서는 이를 `for` 를 통해 별도의 함수에서 처리할 수 있다.

