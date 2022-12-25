import { getConnection, Repository } from 'typeorm';
import { Point } from '../../../src/domain/entity/Point/Point.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getPgTestTypeOrmModule } from '../getPgTestTypeOrmModule';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PointEntityModule } from '../../../src/domain/entity/Point/PointEntityModule';
import { bulkAsyncInsertPoints } from './insert/bulkAsyncInsertPoints';

describe('PointEntity4 ', () => {
  let pointRepository: Repository<Point>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PointEntityModule, getPgTestTypeOrmModule()],
    }).compile();

    pointRepository = module.get(getRepositoryToken(Point));
  });

  afterAll(async () => await getConnection().close());

  beforeEach(async () => await pointRepository.clear());

  it('Point를 async 10_000번 쌓는다', async () => {
    // given
    const count = 10_000;

    // when
    await bulkAsyncInsertPoints(count, pointRepository);

    const actual = await pointRepository.count();
    expect(actual).toBe(count);
  });
});
