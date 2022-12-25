import { Repository } from 'typeorm';
import { Point } from '../../../../src/domain/entity/Point/Point.entity';
import { insertPointByBuilder } from './insertPointByBuilder';

export async function bulkInsertPoints(count: number, pointRepository: Repository<Point>) {
  for (let key = 0; key < count; key++) {
    await pointRepository.insert(Point.of(key * 1_000));
  }
}
