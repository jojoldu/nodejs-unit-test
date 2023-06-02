import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { sleep } from './throw/sleep';
import { Request, Response } from 'express';
import { LocalDateTime } from '@js-joda/core';
import * as assert from 'assert';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/cookie')
  cookie(@Req() request: Request, @Res() response: Response): string {
    response.set('set-cookie', ['name=age; path=/; expires=Wed May 11 2023 19:52:09 GMT+0900 (Korean Standard Time)']);
    console.log(`en`);
    response.set('set-cookie', ['name=age; path=/; expires=Wed May 11 2023 19:52:09 GMT+0900 (대한민국 표준시)']);
    console.log(`ko`);
    return 'cookie';
  }

  @Get('/cookie-en')
  cookieEn(@Req() request: Request, @Res() response: Response): string {
    const cookie = 'name=age; path=/; expires=Wed May 11 2023 19:52:09 GMT+0900 (Korean Standard Time)';
    response.set('set-cookie', [cookie]);
    return 'cookie';
  }

  @Get('/cookie-ko')
  cookieKo(@Req() request: Request, @Res() response: Response): string {
    const cookie = 'name=age; path=/; expires=Wed May 11 2023 19:52:09 GMT+0900 (대한민국 표준시)';
    response.set('set-cookie', [cookie]);
    return 'cookie';
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

  @Get('/assert')
  assertCheck(@Query() query) {
    assert(query.name === 'name', 'name이 아닙니다.');
    return query.name;
  }
}
