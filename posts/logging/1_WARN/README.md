# 1. 유의미한 로그 모니터링하기 - 외부 API 연동

365/24 로 관리하는 백엔드 시스템에서 로그는 굉장히 중요하다.  
습관적으로 **Exception이 발생하면 log.error로 로그**를 남기는 경우가 많다.    
이렇게 될 경우 

> 이 글은 Node.js 기반의 백엔드 시스템으로 예제 코드를 작성했다.  
> 다만, 경험상 JVM 시스템에서도 동일하게 적용해도 무방할 것 같다.

## 외부 API 연동

사내 서비스가 아닌 외부 API 서비스의 호출을 100% 성공하도록 관리하는 것은 불가능하다.  
따라서 이 호출의 일정 비율이 실패하는 것이 일상인 것을 어느정도 전제해야 한다.  

예를 들어 다음과 같이 API 연동이 있다고 가정해보자.

```ts
function get(url): string {
    try {
        return api.getCompanyInfo (url);
    } catch (Exception e) {
        log.error("Error occurred", e);
        return "A default response";
    }
}
```

트래픽이 많은 웹 애플리케이션의 경우 대략 외부 API의 실패율이 `0.1%`만 되어도 실패율은 초당 150개의 오류를 의미한다.  
따라서 각각을 오류로 기록하면 생산 로그에 대량의 노이즈가 생성된다.

```ts
function get(url): string {
    try {
        return api.getCompanyInfo (url);
    } catch (Exception e) {
        log.warn("Error occurred", e);
        return "A default response";
    }
}
```

`ERROR`로 기록하는 것보다 `WARN` 으로 기록하는 것이 좋다.

예외적으로 외부 API이지만 `ERROR` 레벨로 관리해야 하는 경우는 아래정도로 생각한다.

- 현재 트래픽 자체가 높지 않은 경우
  - 연동한 API가 하루 1%의 에러율을 가진다 하더라도 우리 트래픽이 낮아 하나하나의 요청 실패가 중요한 경우엔 그냥 다 ERROR로 처리한다.
- 결제와 같이 한번 실패시 치명적인 영향을 끼치는 서비스인 경우
  - 특히 별도로 [정산 대사](https://docs.tosspayments.com/guides/apis/settlements#%EC%A0%95%EC%82%B0-%EC%A1%B0%ED%9A%8C%ED%95%98%EA%B8%B0)를 시스템화 하지 않았다면 더더욱 중요하다. 
- 하루 1번, 한달에 1번 정도로 요청 자체가 주기적으로 적은 횟수만 수행하는 경우  



## 내부 시스템 연동

다만, 우리 내부의 시스템에 한해서는 `ERROR` 레벨로 관리한다.  
특히 RDS, Redis 등은 무조건 `ERROR` 레벨로 관리하며,  
**사내의 다른 팀 API는 에러율에 따라 적절하게 조정**한다.  




