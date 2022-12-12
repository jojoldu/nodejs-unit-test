import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Point } from './Point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Point])],
  exports: [TypeOrmModule],
  providers: [],
  controllers: [],
})
export class PointEntityModule {}
