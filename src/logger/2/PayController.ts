import { Controller, Get } from '@nestjs/common';
import { PayService } from './PayService';

@Controller()
export class PayController {
  constructor(private readonly payService: PayService) {}

  @Get("/pay/cancel")
  async cancel() {
    return await this.payService.cancel("orderNo");
  }

  @Get("/pay/cancel2")
  async cancel2() {
    return await this.payService.cancel2("orderNo");
  }
}
