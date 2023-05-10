import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  });

