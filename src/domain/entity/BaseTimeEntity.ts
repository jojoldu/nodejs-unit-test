import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Generated,
  PrimaryColumn,
} from 'typeorm';
import { LocalDateTime } from '@js-joda/core';
import { BigintTransformer } from '../transformer/transformer/BigintTransformer';
import { LocalDateTimeTransformer } from '../transformer/transformer/LocalDateTimeTransformer';

export abstract class BaseTimeEntity {
  @Generated('increment')
  @PrimaryColumn({ type: 'bigint', transformer: new BigintTransformer() })
  id: number;

  @Column({
    type: 'timestamptz',
    transformer: new LocalDateTimeTransformer(),
    nullable: false,
    update: false,
  })
  createdAt: LocalDateTime;

  @Column({
    type: 'timestamptz',
    transformer: new LocalDateTimeTransformer(),
    nullable: false,
  })
  updatedAt: LocalDateTime;

  @BeforeInsert()
  protected beforeInsert() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  @BeforeUpdate()
  protected beforeUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
