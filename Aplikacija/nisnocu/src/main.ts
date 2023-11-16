import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { storageConfig } from 'config/storage.config';
import { dirname, join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  console.log(__dirname);
  app.useStaticAssets(join(__dirname, '..', '../../storage/photos'), {
    prefix: '/assets',
  });
  app.useStaticAssets(join(__dirname,'..','../../logo'),{
    prefix:'/logos'
  })
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();