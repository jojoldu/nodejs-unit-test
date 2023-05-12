import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './exception/AllExceptionsFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
bootstrap();

process
  .on('unhandledRejection', (reason: string, p: Promise<any>) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
    throw new Error(reason);
  })
  .on('uncaughtException', (error: Error) => {
    console.log('Uncaught Exception:', error);
    // res.status(500).send(error.message);
  });
