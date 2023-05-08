import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { sleep } from './throw/sleep';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/unhandledRejection')
  unhandledRejection(): void {
    sleep(10).then(() => {  // Promise is rejected
      throw new Error('처리되지 않은 Promise');
    });
  }

  @Get('/uncaughtException')
  uncaughtException(): void {
    throw new Error('처리되지 않은 예외');
  }
}
