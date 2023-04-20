import { Module } from '@nestjs/common';
import { PayController } from './PayController';
import { PayService } from './PayService';

@Module({
  imports: [],
  controllers: [PayController],
  providers: [PayService],
})
export class PayModule {}
