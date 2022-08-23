import { Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './OrderService';
import { LocalDateTime } from "js-joda";
import { NowTime } from "../nowtime/NowTime";

@Controller('/order')
export class OrderController {
    constructor(private readonly orderService: OrderService,
                private readonly nowTime: NowTime) {}

    @Get('/accept')
    accept(orderId: number): void {
        this.orderService.accept(orderId);
    }

    @Post('/discount')
    async discount(orderId: number): Promise<void> {
        await this.orderService.discount(orderId);
    }

    @Post('/discount2')
    async discount2(orderId: number): Promise<void> {
        await this.orderService.discountWith(orderId, this.now());
    }

    now(): LocalDateTime {
        return LocalDateTime.now();
    }

    @Post('/discount3')
    async discount3(orderId: number): Promise<void> {
        await this.orderService.discountWith(orderId, this.nowTime.now());
    }

}
