import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import { ValidationPipe } from '@nestjs/common';
import { pipesConfig } from './config/pipes.config';
async function bootstrap() {
  const { PORT } = process.env;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(pipesConfig));
  app.enableCors(corsConfig);
  await app.listen(PORT);
}
bootstrap();
