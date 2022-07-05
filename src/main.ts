import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors({})
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
  // npm config set strict-ssl false
  // 127.0.0.1/32 pg_hba.conf host address
}
bootstrap();
