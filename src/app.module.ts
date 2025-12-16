import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';

import { User } from './user/user.entity';
import { Course } from './course/course.entity';
import { Lesson } from './lesson/lesson.entity';
import { Enrollment } from './enrollment/enrollment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Якщо є DATABASE_URL (на Render), використовуємо її.
      // Якщо немає (локально) — використовуємо старі налаштування.
      url: process.env.DATABASE_URL,
      host: process.env.DATABASE_URL ? undefined : 'localhost',
      port: process.env.DATABASE_URL ? undefined : 5432,
      username: process.env.DATABASE_URL ? undefined : 'user',
      password: process.env.DATABASE_URL ? undefined : 'password',
      database: process.env.DATABASE_URL ? undefined : 'course_management_db',
      entities: [User, Course, Lesson, Enrollment],
      synchronize: true,
      // Додаємо SSL налаштування, які вимагає Render
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    }),
    UserModule,
    CourseModule,
    LessonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
