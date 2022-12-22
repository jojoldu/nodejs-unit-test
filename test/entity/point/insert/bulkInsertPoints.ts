import { Repository } from 'typeorm';
import { Point } from '../../../../src/domain/entity/Point/Point.entity';

export async function bulkInsertPoints(count: number, pointRepository: Repository<Point>) {
  for (let key = 0; key < count; key++) {
    await pointRepository.save(Point.of(key * 1_000));
  }
}
