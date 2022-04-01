# 소나큐브를 통한 정적 분석

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