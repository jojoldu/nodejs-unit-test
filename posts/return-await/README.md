# Return Await 를 권장하자??

팀을 위한 Exception 처리 내용을 정리하다가 재밌는 글을 보게 되었다.

* [Returning Promises](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/returningpromises.md?s=35)

기존에 우리팀에서 사용하던 방식을 완전히 부정당하게 되서 흥미롭게 읽어볼 수 있었다.  
  
## 문제

Node.js를 비롯한 백엔드에서는 에러가 발생한다면 해당 에러에 대한 상세한 추적 내역은 필수다.  
다만, Node.js에서는 `await` 없이 `Promise` 객체를 그대로 반환할 경우 해당 `Promise` 객체에서 발생한 에러는 Stack Trace 가 남지 않는다.  


동기식 또는 비동기식 흐름에서 오류가 발생하면 오류 흐름의 전체 스택 추적이 필수적입니다.  
놀랍게도 비동기 함수가 기다리지 않고 약속을 반환하면(예: 다른 비동기 함수 호출) 오류가 발생하면 호출자 함수가 스택 추적에 나타나지 않습니다. 이렇게 하면 오류를 진단한 사람에게 부분 정보가 남게 됩니다. 오류 원인이 해당 호출자 함수 내에 있는 경우 더욱 그렇습니다. 스택 추적이 가장 최근의 await. 그러나 사소한 구현 세부 사항으로 인해 함수(동기화 또는 비동기화)의 반환 값이 약속이면 작동하지 않습니다. 따라서 반환된 약속이 거부될 때 스택 추적의 구멍을 피하기 위해,await함수에서 반환하기 전에


* [v8의 제로 비용 비동기 스택 추적에 대한 블로그 게시물](https://v8.dev/blog/fast-async)
* [여기에 언급된 구현 세부 정보가 포함된 제로 비용 비동기 스택 추적에 대한 문서](https://docs.google.com/document/d/13Sy_kBIJGP0XT34V1CV3nkWya4TwYx9L3Yv45LdGB6Q/edit)