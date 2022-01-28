import { Controller, Get } from '@nestjs/common';
import { OrderService } from './OrderService';

@Controller('/order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get('/accept')
    accept(): string {
        return this.orderService.accept();
    }
}
