import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, //this cast to type define in dto
      whitelist: true, //remove unknown properties
      // forbidNonWhitelisted: true, //throw error if unknown properties
      // forbidUnknownValues: true, //throw error if unknown values
      // skipMissingProperties: false, //throw error if missing properties
      // disableErrorMessages: true, //disable error messages
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
