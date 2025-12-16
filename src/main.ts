import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Course Management API')
    .setDescription('Інтерактивна документація структури проекту Lab 6')
    .setVersion('1.0')
    .addTag('users')
    .addTag('courses')
    .addTag('lessons')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
