import { getConnection, Repository } from 'typeorm';
import { Point } from '../../../src/domain/entity/Point/Point.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getPgTestTypeOrmModule } from '../getPgTestTypeOrmModule';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PointEntityModule } from '../../../src/domain/entity/Point/PointEntityModule';
import { bulkInsertPoints } from './insert/bulkInsertPoints';

describe('PointEntity2', () => {
  let pointRepository: Repository<Point>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PointEntityModule, getPgTestTypeOrmModule()],
    }).compile();

    pointRepository = module.get(getRepositoryToken(Point));
  });

  afterAll(async () => await getConnection().close());

  beforeEach(async () => await pointRepository.clear());

  it('Point를 10_000번 쌓는다 (1)', async () => {
    // given
    const count = 10_000;

    // when
    await bulkInsertPoints(count, pointRepository);
  });

  it('Point를 10_000번 쌓는다 (2)', async () => {
    // given
    const count = 10_000;

    // when
    await bulkInsertPoints(count, pointRepository);
  });
});
