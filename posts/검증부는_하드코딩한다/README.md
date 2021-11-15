# 검증 코드는 하드코딩 하는 것이 낫다.

최근 코드리뷰를 하다가 자주 지적하던 내용이 있어, 정리하게 되었다.  

요즘 팀 분들이 가장 많이 하는 실수가 바로 **검증부에 도메인 로직이 추가되는 것**이다.  

이를테면 다음과 같은 구현 클래스가 있다고 해보자.

```javascript
export class FilePath {
    private readonly _path1: string;
    private readonly _path2: string;
    private readonly _path3: string;
    private readonly _path4: string;

    constructor(path1: string, path2: string, path3: string, path4: string) {
        this._path1 = path1;
        this._path2 = path2;
        this._path3 = path3;
        this._path4 = path4;
    }

    get fullPath(): string {
        return `C:\\Output Folder\\${[this._path1, this._path2, this._path3, this._path4].join('\\')}`;
    }

    get path1(): string {
        return this._path1;
    }

    get path2(): string {
        return this._path2;
    }

    get path3(): string {
        return this._path3;
    }

    get path4(): string {
        return this._path4;
    }
}
```

여기에서 `fullPath` 을 테스트한다고 하면 일반적으로 아래 2가지 케이스로 작성할 수 있다.  

**하드코딩된 결과**

```javascript
it('하드 코딩된 결과 검증', () => {
    const sut = new FilePath('fields', 'that later', 'determine', 'a folder');
    const expected = 'C:\\Output Folder\\fields\\that later\\determine\\a folder';

    expect(sut.fullPath).toBe(expected);
});
```

**소프트 코딩(도메인 로직을 사용한) 결과**

```javascript
it('소프트 코딩된 결과 검증', () => {
    const sut = new FilePath('fields', 'that later', 'determine', 'a folder');
    const expected = `C:\\Output Folder\\${[sut.path1, sut.path2, sut.path3, sut.path4].join('\\')}`;
    expect(sut.fullPath).toBe(expected);
});
```

여기에서 어떤 방식이 좋을까?  
경험상 **하드코딩된 결과물을 사용하는 것이 훨씬 좋다**.  

후자인 소프트 코딩(도메인 로직을 사용한) 는 왜 안좋을까?

## 문제점

### 1. 무의미한 검증

후자인 소프트 코딩 (도메인 로직을 사용한) 방식은 사실상 **프로덕션 코드를 복사 & 붙여넣기 한 것 외에는 없다**.  
이렇게 되면 사실상 검증 하는 것이 없는것과 다를바 없는데,  
더 큰 문제는 **프로덕션 코드와 강결합**하게 된다는 것이다.  

만약 도메인 로직이 **결과는 동일하지만 로직은 변경되는 리팩토링**을 한다면 테스트 코드는 어떻게 할 것인가?  
잘못된 테스트 도메인 로직을 그대로 둘 것인가?  
아니면 결과는 동일하니 그대로 둘 것인가?  

어떤 상황이든 문제가 된다.  

조금 극단적인 사례로 간다면 이는 다음과 다를바 없다.  

> 아래 예제 코드는 [단위 테스트](http://www.yes24.com/Product/Goods/104084175) 에서 나온 코드를 사용하였다.

```ts
sum(val1, val2) {
  return val1 + val2;
}

....

it('sum 테스트', async () => {
  const val1 = 1;
  const val2 = 2;

  const result = sum(val1, val2);

  expect(result).toBe(val1 + val2);
}

```

이와 같이 `a+b` 로직의 검증을 `a+b` 로 한다는 것이 과연 의미가 있는 테스트일까?  
누가 봐도 의미가 없는 테스트이다.

### 2. 거짓 성공

이 **도메인 로직 자체가 버그인 경우에도 테스트가 실패하지 않는다**.  

내가 검증하고자 하는 로직에서 버그가 있는지 아닌지를 판별하는 것이 테스트 코드인데,  
도메인 로직을 그대로 복사해버리면, 해당 코드에 버그가 있어도 검증문이 동일한 코드를 사용하고 있어 테스트가 실패할 수가 없다.  

내가 생각한 도메인 로직이 확실하다는 것을 보장 받기 위해 작성하는 것이 테스트 코드이다.  
검증문에 동일한 로직을 사용하는 순간 **내 도메인 로직은 검증을 보장받지 못하게 된다**.


### 3. Test First의 어려움

일반적으로 TDD 라고 한다면 Test First 를 이야기 한다.  

> XUnit Test Pattern 서두에서도 설명하지만, TDD 라고 해서 꼭 Test First만 포함하지 않고, Test Last도 포함한다.  
> 하지만 일반적으로는 대부분 TDD 라 하면 Test First를 생각하니 대부분 TDD 라 하면 Test First를 생각하는것이 좋다.

Test First의 TDD를 한다고 생각하면 소프트 코딩된 결과를 미리 작성할 수 있을까?  
예를 들어 **아래 코드를 프로덕션 (구현) 코드를 작성하기 전에 미리 작성할 수 있을까?**

```javascript
it('소프트 코딩된 결과 검증', () => {
    const sut = new FilePath('fields', 'that later', 'determine', 'a folder');
    const expected = `C:\\Output Folder\\${[sut.path1, sut.path2, sut.path3, sut.path4].join('\\')}`;
    expect(sut.fullPath).toBe(expected);
});
```

Test First 자체가 구현부를 미리 생각하고 진행하는 것이 아니라, 예상 결과를 미리 테스트 코드로 구현후 구현부를 만들고 리팩토링 하는 과정으로 진행한다.  
그렇기 때문에 이미 구현부를 테스트 코드에서 선작성하는 것은 **리팩토링 과정을 포기하는 것**과 다를바 없다.  

애초에 이 도메인 로직을 구현하기도 전에 어떻게 검증문을 작성할 수 있을까?  

소프트코드를 작성한다는 것 자체가 **나는 Test First로 개발하지 않는다는 것을 의미한다**.  

> 물론 테스트가 없는 레거시 코드에 테스트를 넣는 경우엔 당연히 Test First를 할 수는 없다.

이런 소프트 검증문의 경우 결과에 대한 예측도 할 수가 없다.  
다음과 같이 `expected` 가 선언된 경우 **결과가 예상이 될까?**

```javascript
string expected = "C:\\Output Folder" + string.Join("\\", target.Field1, target.Field2, target.Field3, target.Field4);
```

## 마무리

소프트 코드 검증문 (도메인 로직을 포함한 검증문)은 다음의 문제점들이 있다.

* 무의미한 검증
* 구현코드와의 강결합
* 거짓 성공
* 결과 예측의 어려움
* Test First 개발의 어려움

그래서 단위 테스트에서는 검증부를 하드코딩하는 것이 좋다.  
