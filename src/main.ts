import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const whitelist = ['http://localhost:4200', 'https://ecopack-f91d0.web.app'];

  app.enableCors({
    credentials: true,
    // origin: (origin, callback) => {
    //   if(whitelist.includes(origin))
    //     return callback(null, true)
  
    //     callback(new Error('Not allowed by CORS'));
    // }
    origin: whitelist[0]
  })
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
