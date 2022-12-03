# 데이터베이스 통합 테스트 성능 개선하기 (Docker & PostgreSQL)

## tmpfs

### data

데이터베이스는 이미 가능한 한 디스크 작업을 피하는 방식으로 작성되었으며 일단 모든 내구성 설정을 끄면 (메모리에 맞는 데이터 세트의 경우) 거의 디스크 읽기/쓰기를 중지합니다

### /run, /var/cache

[/run](https://unix.stackexchange.com/questions/13972/what-is-this-new-run-filesystem)

## Non Durable

e2e 테스트 중에  희생할 수 있습니다 . 내구성은 서버가 충돌하거나 전원이 꺼지더라도 데이터 저장을 보장하며 일반적으로 e2e 테스트 중에 필요하지 않습니다. e2e 테스트가 가능한 생산에 가까운 시스템을 테스트해야 한다는 것은 논쟁의 여지가 있지만 테스트 속도를 높여야 한다면 이것은 가치 있는 절충안이라고 생각합니다.

/var/lib/postgresql/data/postgresql.conf파일 에 다음을 추가하기만 하면 됩니다.

```bash
fsync = off
synchronous_commit = off
full_page_writes = off
```

이러한 설정을 사용하여 테스트 실행 시간을 ~20%까지 줄일 수 있었습니다. 우리의 e2e 테스트가 모두 db에 초점을 맞춘 것이 아니라는 점을 감안할 때 이것은 좋은 결과라고 생각합니다.
