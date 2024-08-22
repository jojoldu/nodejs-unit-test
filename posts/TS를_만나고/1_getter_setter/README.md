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