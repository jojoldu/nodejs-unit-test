# 1. TS를 만나고 - 좋은 디자인


```java
public class Course {
    private int price;

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        if (price > 0) { // 간단한 검증 논리
            this.price = price;
        }
    }
}
```

```ts
public class Course {
    private int price;

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        if (price > 0) { // 간단한 검증 논리
            this.price = price;
        }
    }
}
```

```java
import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter
public class Course {

    private int price;
    ...

    public void setPrice(int price) {
        if (price > 0) { // 간단한 검증 논리
            this.price = price;
        } 
    }
}
```

```kotlin
class Course(private var _price: Int) {

    var price: Int
        get() = _price
        set(value) {
            if (value > 0) { // 간단한 검증 논리
                _price = value
            } else {
                throw IllegalArgumentException("Price must be greater than 0")
            }
        }
}
```

다음과 같이 굳이 별도의 인터페이스 변경 없이 사용 가능하다.

```kotlin
course.price = 200
val coursePrice = course.price
```

