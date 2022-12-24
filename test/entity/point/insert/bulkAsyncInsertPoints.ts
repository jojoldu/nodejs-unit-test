import { Repository } from 'typeorm';
import { Point } from '../../../../src/domain/entity/Point/Point.entity';

export async function bulkAsyncInsertPoints(count: number, pointRepository: Repository<Point>) {
  const points = [];
  for (let key = 0; key < count; key++) {
    points.push(Point.of(key * 1_000));
  }

  await Promise.all(points.map(p => pointRepository.insert(p)));
}
