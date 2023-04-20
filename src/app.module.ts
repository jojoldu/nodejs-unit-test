import { MiddlewareConsumer, Module, NestModule, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PayModule } from './logger/2/PayModule';

@Module({
  imports: [PayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule, OnApplicationBootstrap{
  configure(consumer: MiddlewareConsumer): any {
  }

  onApplicationBootstrap(): any {
  }
}
