import { ValueTransformer } from 'typeorm';
import { LocalDate } from '@js-joda/core';
import { DateTimeUtil } from '../../../util/DateTimeUtil';

export class LocalDateTransformer implements ValueTransformer {
  // entity -> db로 넣을때
  to(entityValue: LocalDate): Date | null {
    return DateTimeUtil.toDate(entityValue);
  }

  // db -> entity로 가져올때
  from(databaseValue: Date): LocalDate | null {
    return DateTimeUtil.toLocalDate(databaseValue);
  }
}
