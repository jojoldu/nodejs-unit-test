import { Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './OrderService';
import { LocalDateTime } from "js-joda";

@Controller('/order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get('/accept')
    accept(orderId: number): void {
        return this.orderService.accept(orderId);
    }

    @Post('/discount')
    async discount(orderId: number): Promise<void> {
        await this.orderService.discount(orderId);
    }

    now(): LocalDateTime {
        return LocalDateTime.now();
    }
}
