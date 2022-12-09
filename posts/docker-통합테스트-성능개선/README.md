# 데이터베이스 통합 테스트 성능 개선하기 (Docker & PostgreSQL)


![test-pyramid](./images/test-pyramid.png)

* 출처: [TestPyramid](https://martinfowler.com/bliki/TestPyramid.html)

다만, 당장의 모든 통합 테스트를 다 단위 테스트로 전환하는 것이 부담된다면, 현재의 느린 통합 테스트들의 

## 문제

보통 통합 테스트는 SQLite, H2와 같은 InMemory 데이터베이스를 사용한다.  
메모리상에만 존재하기 때문에 실제 ORM (SQL) 을 검증이 가능하면서도 **병렬로 테스트를 수행**할 수 있고, **고속의 쿼리 수행**이 가능하기 때문이다.  

대부분의 데이터베이스 쿼리는 InMemory DB 에 대해 실행할 수 있지만 많은 엔터프라이즈 시스템은 실제 프로덕션과 같은 관계형 데이터베이스에 대해서만 테스트할 수 있는 복잡한 기본 쿼리를 사용한다.  
  
그래서 테스트의 일부 (혹은 많은) 기능들은 Docker를 통해 운영과 동일한 데이터베이스를 

이 게시물에서는 메모리 내 데이터베이스만큼 빠르게 PostgreSQL 및 MySQL 통합 테스트를 실행할 수 있는 방법을 보여드리겠습니다.

## 해결


## tmpfs

### data

데이터베이스는 이미 가능한 한 디스크 작업을 피하는 방식으로 작성되었으며 일단 모든 내구성 설정을 끄면 (메모리에 맞는 데이터 세트의 경우) 거의 디스크 읽기/쓰기를 중지합니다

### /run, /var/cache

[/run](https://unix.stackexchange.com/questions/13972/what-is-this-new-run-filesystem)

## Non Durability

내구성 (Durability) 은 서버가 충돌하거나 전원이 꺼지더라도 데이터 저장을 보장하는 기능이다.  
보편적인 RDBMS에서는 필수 기능이나, E2E 테스트에서는 중요한 기능이 아니다.    
E2E 테스트가 가능한 운영 (Production) 환경에 최대한 비슷한 형태로 테스트 해야한다는 의견이 있지만 (이 역시도 논쟁거리이긴하지만) 내구성 (Durability)에 한해서는 충분히 절충 가능한 사안이다.  
특히 테스트 성능에 영향을 끼친다면 더욱 그렇다.  
  
PostgreSQL에서는 내구성 (Durability) 를 다음의 방식으로 `off` 시킬 수 있다.

* https://www.postgresql.org/docs/13/non-durability.html

/var/lib/postgresql/data/postgresql.conf파일 에 다음을 추가하기만 하면 됩니다.

```bash
fsync = off
synchronous_commit = off
full_page_writes = off
```

이러한 설정을 사용하여 테스트 실행 시간을 ~20%까지 줄일 수 있었습니다. 우리의 e2e 테스트가 모두 db에 초점을 맞춘 것이 아니라는 점을 감안할 때 이것은 좋은 결과라고 생각합니다.

### max_wal_size & checkpoint_timeout

https://www.crunchydata.com/blog/tuning-your-postgres-database-for-high-write-loads

## unlogged table

내구성 (Durability) 과 마찬가지로 테이블의 로그를 관리하는 정보 역시 E2E 테스트 안에서는 성능을 위해 절충할 수 있는 기능이다.  
  

https://www.compose.com/articles/faster-performance-with-unlogged-tables-in-postgresql/

```ts
import { DatabaseTable } from '@mikro-orm/better-sqlite';
import { MikroORM } from '@mikro-orm/core';

export async function generateTestSchema(orm: MikroORM) {
  const schemaGenerator = orm.getSchemaGenerator();
  await schemaGenerator.refreshDatabase();
  // @ts-ignore
  const tables: DatabaseTable[] = schemaGenerator.getTargetSchema().getTables();

  await Promise.all(
    tables.map(async (table) =>
      schemaGenerator.execute(`ALTER TABLE "${table.name}" SET UNLOGGED`),
    ),
  );
}
```

> 물론 이 코드는 MikroORM을 사용했지만, TypeORM에서도 충분히 활용가능하다.
 
```ts

```