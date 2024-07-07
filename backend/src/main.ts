import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsMiddleware } from './middleware/CORSMiddleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(CorsMiddleware);

  await app.listen(3000);
}
bootstrap();
