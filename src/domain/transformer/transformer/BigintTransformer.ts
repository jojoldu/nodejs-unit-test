import { ValueTransformer } from 'typeorm';

/**
 * `JSON.stringify` 이슈로 인해 `find` 함수들에서 모두 에러가 발생한다.
 * 그래서 bigint 타입으로의 전환은 불가능하다.
 * https://github.com/tc39/proposal-bigint/issues/24 에서 bigint가 대상에 포함되면 그때 아래 코드로 전환한다.
 * <code>
 export class BigintTransformer implements ValueTransformer {
    to(entityValue: bigint) {
        return entityValue;
    }

    from(databaseValue: string): bigint {
        return BigInt(databaseValue);
    }
 }
 </code>
 */
export class BigintTransformer implements ValueTransformer {
  to(entityValue: number) {
    return entityValue;
  }

  from(databaseValue: string): number | null {
    return parseInt(databaseValue, 10) || null;
  }
}
