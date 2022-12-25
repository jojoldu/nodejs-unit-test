import { Point } from '../../../../src/domain/entity/Point/Point.entity';
import { getConnection } from 'typeorm';

export async function insertPointByBuilder(key, connection = getConnection()) {
    await connection.createQueryBuilder()
      .insert()
      .into(Point)
      .values(Point.of(key * 1_000))
      .execute();
}
