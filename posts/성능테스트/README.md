# Node.js 에서 성능 테스트

## 테스트 환경

- Node 18.18.2
- 성능 분석 도구: [Clinic.js](https://clinicjs.org/)
  - `npm install -g clinic`


## Memory Leak

GC 는 오직 참조되지 않는 객체만을 정리하기 때문에, Event Emitter 는 리스너가 사용된 이후에 GC에 의해 정리되지 않는다.



## CPU Intensive