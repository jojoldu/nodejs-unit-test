import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { ConstraintSnakeNamingStrategy } from '../../src/domain/config/ConstraintSnakeNamingStrategy';

export function getPgTestTypeOrmModule(dropSchema = false) {
  const connectionTimeout = 1_000; // 1초
  console.log(path.join(__dirname, '../../src/domain/entity/**/*.entity.ts'));
  return TypeOrmModule.forRoot({
    maxQueryExecutionTime: connectionTimeout,
    extra: {
      statement_timeout: connectionTimeout,
      min: 2,
      max: 20,
    },
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'test',
    password: 'test',
    database: 'test',
    entities: [path.join(__dirname, '../src/domain/**/*.domain.ts')],
    synchronize: true,
    logging: false,
    namingStrategy: new ConstraintSnakeNamingStrategy(),
  });
}
