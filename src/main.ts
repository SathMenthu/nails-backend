import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { json } from 'express';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin: 'http://localhost:8080' });
  app.use(json({ limit: '150mb' }));
  app.use(cookieParser());
  app.use(
    rateLimit({
      windowMs: 5 * 60 * 1000,
      max: 100,
    }),
  );
  await app.listen(80);
}
bootstrap();
