import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Налаштування префіксу (якщо ви його використовуєте)
  app.setGlobalPrefix('api/v1');

  // Конфігурація Swagger
  const config = new DocumentBuilder()
    .setTitle('Course Management API')
    .setDescription('The API description for Lab 6 Project Structure')
    .setVersion('1.0')
    .addTag('courses')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Swagger буде доступний за адресою /api/docs
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
}

// Виправляємо помилку floating-promise через .catch()
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
