# SonarCloud를 통한 Node.js & Jest 프로젝트 정적 분석하기

> **회사에서 사용한다면 SonarQube를 추천한다**.  
> 아직까지 SonarQube 만큼의 기능이 SonarCloud에서 지원하지 못하고 있다.
> [SonarCloud or SonarQube? - Guidance on Choosing One for Your Team](https://blog.sonarsource.com/sq-sc_guidance)

```bash
yarn add --dev jest-sonar-reporter sonarqube-scanner
```

```json
{
    ...
    "scripts": {
        ...
        "test:coverage": "jest --coverage",
        "sonar": "node sonar-project.js",
        ...
    },
    ...
    "jest": {
        ...
        "testResultsProcessor": "jest-sonar-reporter"
        ...
    },
    "jestSonar": {
        "reportPath": "coverage",
        "reportFile": "cover.xml"
    }
    ...
}
```

```typescript
const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
    {
        options: {
            'sonar.projectName': 'EXAM_PROJECT',
            'sonar.projectKey': 'EXAM_PROJECT',
            'sonar.host.url': 'http://192.168.0.100:9000',
            'sonar.login': '20d6fe35cb1c689e6f3fcb9a8957491726826fa5',
            'sonar.sources': 'src',
            'sonar.tests': 'src',
            'sonar.inclusions': '**',
            'sonar.test.inclusions': 'src/**/*.spec.js,src/**/*.spec.jsx,src/**/*.test.js,src/**/*.test.jsx',
            'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
            'sonar.testExecutionReportPaths': 'coverage/cover.xml',
        },
    },
    () => process.exit(),
);

module.exports = sonarqubeScanner;
```

```bash
yarn test:coverage
yarn sonar
```


* https://dev.to/rafaeldias97/nodejs-express-docker-jest-sonarqube-45me