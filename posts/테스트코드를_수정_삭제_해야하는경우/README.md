# 테스트 코드를 수정/삭제 해야하는 경우

테스트를 제거하는 주된 이유는 테스트가 실패하기 때문이다. 
여러 가지 이유로 테스트가 갑자기 실패할 수 있다.

- 프로덕션 버그: 테스트 중인 프로덕션 코드에 버그가 있는 경우
- 테스트 버그: 테스트에 버그가 있는 경우
  - 테스트가 실패해야 할 때 실패하는지 확인한다.
  - 테스트가 통과해야 할 때 통과하는지 확인한다.
- 의미 체계 또는 API 변경: 테스트 중인 코드의 의미 체계가 변경되었지만 기능은 변경되지 않은 경우
- 충돌하거나 유효하지 않은 테스트: 충돌하는 요구 사항을 반영하기 위해 프로덕션 코드가 변경된 경우

테스트나 코드에 아무런 문제가 없을 때 테스트를 변경하거나 제거하는 이유도 있다.

- 테스트 이름을 바꾸거나 리팩터링할 때
- 중복 테스트를 제거할 경우

