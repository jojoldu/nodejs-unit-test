# 구름 COMMIT 발표

## 왜 테스트 코드가 필요한가?

## 왜 테스트 하기 좋은 코드가 필요한가? 좋은 테스트 코드와 테스트 하기 좋은 코드는 다른가?

## 좋은 테스트 코드의 특징

## 테스트 하기 어려운 코드를 개선하기

### 1. 


```java
  public class LogAnalyzerTests
  {
       public void Analyze_TooShortFileName_CallsWebService()
       {
ManualMockService mockService = new ManualMockService ();
           LogAnalyzer log = new LogAnalyzer(mockService);
           string tooShortFileName="abc.ext";
           log.Analyze(tooShortFileName);
Assert.AreEqual("Filename too short:abc.ext",
mockService.LastError);
       }
   }
   public class ManualMockService:IWebService
   {
       public string LastError;

       public void LogError(string message)
       {
           LastError = message;
       }
   }
```

```java
 public void Analyze_TooShortFileName_ErrorLoggedToService()
 {
 MockRepository mocks = new MockRepository();
 IWebService simulatedService =
  MockRespository.DynamicMock<IWebService>();

  using(mocks.Record())
  {
     simulatedService.LogError("bad string");
}

       LogAnalyzer log = new LogAnalyzer(simulatedService);
      string tooShortFileName="abc.ext";
      log.Analyze(tooShortFileName);

mocks.VerifyAll();
}
```