import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const whitelist = ['http://localhost:4200', 'http://example2.com'];

  app.enableCors({
    credentials: true,
    origin: (origin, callback) => {
      if(whitelist.includes(origin))
        return callback(null, true)
  
        callback(new Error('Not allowed by CORS'));
    }
  })
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
  // npm config set strict-ssl false
  // 127.0.0.1/32 pg_hba.conf host address
}
bootstrap();
