import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { ConstraintSnakeNamingStrategy } from '../../src/domain/config/ConstraintSnakeNamingStrategy';

export function getPgTestTypeOrmModule(dropSchema = false) {
  const connectionTimeout = 1_000; // 1초

  return TypeOrmModule.forRoot({
    maxQueryExecutionTime: connectionTimeout,
    extra: {
      statement_timeout: connectionTimeout,
      min: 1,
      max: 5,
    },
    type: 'postgres',
    entities: [path.join(__dirname, '../src/domain/**/*.domain.ts')],
    synchronize: true,
    logging: false,
    dropSchema,
    namingStrategy: new ConstraintSnakeNamingStrategy(),
  });
}
