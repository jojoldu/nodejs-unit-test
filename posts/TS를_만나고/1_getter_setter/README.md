# 1. TS를 만나고 - 객체 디자인

> JVM 컨퍼런스가 있으면 "Java 세상에서 살던 사람이 처음 TS 세계를 만나고 느낀 여러가지 차이점" 을 발표하려고했는데, 시간도 너무 지났고, 발표 준비하기도 쉽지 않은 것 같아 블로그에 시리즈로 시작한다.  
> Java가 구린 언어다를 표현하기 위한 글이기 보다는 [전작(다른 언어로 성장하기)](https://jojoldu.tistory.com/687)과 마찬가지로 타 생태계를 통해 성장할 수 있음을 알리는 글이다
 
자바를 처음 배울때 `getter/setter` 에 대한 이야기를 많이 들었다.  
캡슐화 등의 장점을 들으면서 클래스 안에는 항상 무분별하게 `getter/setter` 를 생성했다.  
(그때는 Lombok을 배우지 못했던 터라) IDE의 자동 생성 기능을 사용하면서 열심히 `getter/setter`를 생성했다.  
  
물론 예전부터 많은 분들은 무분별한 getter/setter를 사용하지말라는 글과 토론을 나누었다.

- [2014.09.16 - getters-and-setters-are-evil](https://www.yegor256.com/2014/09/16/getters-and-setters-are-evil.html)

다만, 내가 배울때 법칙?처럼 `getter/setter` 만든다로 배워서 그렇게 했다.  
(지금이야 getter/setter를 쓰지 않고, [Tell, Don't Ask](https://martinfowler.com/bliki/TellDontAsk.html) 를 당연한 것처럼 다뤄지고 있지만 말이다.)  
  
여튼, 배우던 당시에는 무분별하게 `getter/setter`를 만들다보니 "**어차피 단순한 data holders로 사용하는데 그냥 public으로 열면 안되나**" 같은 생각이 들었다.  
  
이를 테면 다음과 같다.  
매번 아래와 같이 생성하는데,

```java
public class Course {
    private int price;

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }
}
```

아래와 같이 "그냥 `public` 으로 열어두는 것과 무엇이 다르지?" 라는 생각인 것이다.  

```java
public class Course {
    public int price;
}
```

어차피 값을 넣고 빼는 역할 밖에 없는데, 똑같지 않나? 라는 생각을 하곤 했다.  
  
그러다가 기능이 여러가지로 확장되는 상황을 만나니 접근자를 통해서 사용해야하는 것의 중요성을 알게 되었다.  
  
예를 들어 단순히 `price`에 값을 넣기만 하면 되는 로직에서 아래와 같이 **부가세 10%가 추가된 가격으로 반환해야한다**는 조건이 추가되니 단순히 `public` 으로 열어두는 것은 기존의 코드를 모두 바꿔야하는 문제가 생겼다.

```java
public class Course {
    ...

    public int getPrice() {
        return (int) (price * 1.1); // 부가세 10% 적용
    }
}

coursePrice = course.price; // <<< 이렇게 호출되는 코드들이
coursePrice = course.getPrice(); // <<< 이 코드로 모두 변경되어야만 했다.
```

접근자를 통해서 처음 구현해두지 않으니, 이런 경우가 발생했다.  
그래서 "**처음부터 접근자를 생성해두고, 이를 호출자들이 사용하도록 해야만 이런 문제를 겪지 않는 다**" 는 것을 알게되었다.  
  
다만, 그럼 "매번 이렇게 접근자를 생성해두고 코드를 작성해야하는 불편함과 귀찮음은 어쩔 수 없는 것인가" 라는 생각은 계속 들었다.   
  
그러던 중, JavaScript/TypeScript 코드들을 보게 되었는데, 여기서는 `get/set` 접근자를 언어 레벨에서 지원했다.  
  
즉, **아래 2개 코드는 호출자 입장에서 동일한 방법으로 호출할 수 있다**.

```ts
// 1. 접근자 없이 public 필드
class Course {
    public price: number;

    constructor(price: number) {
        this.price = price;
    }
}

// 2. 접근자를 통한 접근
class Course {
    private _price: number;

    ...
    
    get price(): number {
        return this._price;
    }
}

val price = course.price; // 1, 2 모두 동일한 코드로 호출
```

이건 코틀린도 동일한데, 코틀린 역시 `get/set` 접근자를 언어 레벨에서 지원한다.  

```kotlin
// 1. 접근자 없이 public 필드
class Course(var price: Int)

// 2. 접근자를 통한 접근
class Course(private var _price: Int) {
    var price: Int
        get() = (_price * 1.1).toInt() // 부가세 10% 적용
}

val coursePrice = course.price
```

(코틀린과 자바를 굳이 다른 생태계라고 구분하지는 않지만)  
이런 개념이 요즘의 모던한 언어들에게는 기본적으로 내장되어있다.  
  
Java를 처음 배우는 입장에서는 "public 필드를 사용하면 안되고, private 필드를 사용하고 이에 대한 접근자를 무조건 생성해야한다" 를 배워야만 했다.  
이걸 그나마 편하게 하기 위해 Lombok 라이브러리 등의 도입도 알아야만 한다.  
만약 이 모든걸 무시하고 처음 배운 클래스에서 단순히 public 필드를 사용하면 이후에 큰 비용을 지불하게 된다.  
  
반면, **JS, TS, Kotlin 등의 언어를 배우는 입장에서는 이런 것이 고민 거리이자 배워야할 내용이 되지 않는다**.  
public 필드를 사용하는 것과 접근자를 통한 접근이 모두 **동일한 인터페이스를 지원하기 때문에 내가 알게되는 지식이 늘어난다고해서 기존의 코드들이 전체 교체 될 일은 거의 없다**.  
즉, 프로그래밍을 배우고 사용할때 중요한 고민거리가 하나 없어지게 되는 셈이다.    
  
이런 사례는 **언어 레벨에서 좋은 디자인 인터페이스를 지원한다** 라는 의미로 다가왔다.  
  
처음 클래스를 배울때 단순하게 public으로 모든 필드를 선언하고 코드를 작성하더라도 이후에 **접근자 (accessor) 개념을 배우고 클래스 코드를 변경하더라도 기존 호출자 코드에 변경이 필요하지 않는다**는 것을 초보 개발자들에게 알려줄 수 있는 셈이다.  
  
이걸로 변경에 유연한 디자인을 아주 쉽게 익히게 된다.  
Lombok 같은 외부의 라이브러리를 도입해야한다거나,  
접근자 (accessor) 에 대한 개념을 배운다던가 그런 언어 외적인 추가적인 학습없이 말이다.    

## 마무리

좋은 언어는 그 자체로 좋은 디자인을 배울 수 있어야 한다는 생각을 한다.  
그런면에서 문법 설탕에 불과하다고 이야기하는 사람들도 있지만, 특정 프레임워크, 라이브러리의 도움으로 해결하는 문제들을 언어 레벨에서 직접 해결해주고 있다는 점이 참 좋았다.  
  
그리고 그런 개념들이 TS, Kotlin 등 Java가 아닌 다른 언어에서는 당연하게도 들어가 있다는 점이 섬세하게도 느껴졌다.  
(물론 Kotlin과 Java 사이에 큰 차이가 있냐는 의견에도 동의하지만 말이다.)

## 함께 보면 좋은 글

- [다른 언어로 성장하기](https://jojoldu.tistory.com/687)