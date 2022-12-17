import { getConnection, Repository } from 'typeorm';
import { Point } from '../../../src/domain/entity/Point/Point.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getPgTestTypeOrmModule } from '../getPgTestTypeOrmModule';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PointEntityModule } from '../../../src/domain/entity/Point/PointEntityModule';

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

  it('Point를 2_000번 쌓는다', async () => {
    // given
    const count = 2_000;

    // when
    for (let key = 0; key < count; key++) {
      await pointRepository.save(Point.of(key * 1_000));
    }
  });
});
