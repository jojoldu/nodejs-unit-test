import { Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './OrderService';

@Controller('/order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get('/accept')
    accept(orderId: number): void {
        return this.orderService.accept(orderId);
    }

    @Post('/discount')
    discount(orderId: number): void {
        return this.orderService.discount(orderId);
    }
}
