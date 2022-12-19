import { getConnection, Repository } from 'typeorm';
import { Point } from '../../../src/domain/entity/Point/Point.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getPgTestTypeOrmModule } from '../getPgTestTypeOrmModule';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PointEntityModule } from '../../../src/domain/entity/Point/PointEntityModule';
import { unloggedTable } from '../unloggedTable';
import { bulkInsertPoints } from './bulkInsertPoints';

describe('PointEntity', () => {
  let pointRepository: Repository<Point>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PointEntityModule, getPgTestTypeOrmModule()],
    }).compile();

    // await unloggedTable(getConnection());

    pointRepository = module.get(getRepositoryToken(Point));
  });

  afterAll(async () => await getConnection().close());

  beforeEach(async () => await pointRepository.clear());

  it('Point를 1_000번 쌓는다', async () => {
    // given
    const count = 1000;

    // when
    await bulkInsertPoints(count, pointRepository);
  });
});
