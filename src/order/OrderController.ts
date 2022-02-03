import { Controller, Get } from '@nestjs/common';
import { OrderService } from './OrderService';

@Controller('/order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get('/accept')
    accept(orderId: number): void {
        return this.orderService.accept(orderId);
    }
}
