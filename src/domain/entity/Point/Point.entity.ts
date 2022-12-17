import { BaseTimeEntity } from '../BaseTimeEntity';
import { Column, Entity } from 'typeorm';
import { LocalDateTimeTransformer } from '../../transformer/transformer/LocalDateTimeTransformer';
import { LocalDateTime } from '@js-joda/core';

@Entity()
export class Point extends BaseTimeEntity{

  @Column()
  amount: number;

  @Column({
    type: 'timestamptz',
    transformer: new LocalDateTimeTransformer(),
    nullable: true,
  })
  requestAt: LocalDateTime;

  @Column()
  description: string;

  constructor() {
    super();
  }

  static of (amount: number, requestAt= LocalDateTime.now(), description?: string): Point {
    const entity = new Point();
    entity.amount = amount;
    entity.requestAt = requestAt;
    entity.description = description;

    return entity;
  }
}
