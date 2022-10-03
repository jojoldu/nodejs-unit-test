# 5. 테스트하기 좋은 코드 - SQL

지난 시간까지 애플리케이션 코드를 어떻게 개선하면 좋을지에 대해 이야기를 나눴다.

[1. 테스트하기 어려운 코드](https://jojoldu.tistory.com/674)  
[2. 제어할 수 없는 코드 개선](https://jojoldu.tistory.com/676)  
[3. 외부에 의존하는 코드 개선](https://jojoldu.tistory.com/680)  
[4. 검증이 필요한 비공개 함수 개선](https://jojoldu.tistory.com/681)  


## 5-1. 문제 상황

```sql
queryBuilder.query(`
SELECT *
FROM table
WHERE created_at <=  NOW()
`);
```

이 테스트는 왜 테스트 작성이 너무나 어려운것일까?

* 실행할때마다 변경되는 현재 시간 쿼리 함수 (`NOW()`) 를 쿼리 내부에서 쓰고 있다

* 현재 테스트로 사용중인 데이터베이스에


## 5-2. 해결 방법

