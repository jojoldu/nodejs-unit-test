import { Controller, Get } from '@nestjs/common';
import { OrderService } from './OrderService';

@Controller()
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get()
    getHello(): string {
        return this.orderService.getHello();
    }
}
