// @ts-nocheck
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module'; // [1] НОВИЙ ІМПОРТ LessonModule

// Імпорт усіх створених сутностей (Entities)
import { User } from './user/user.entity';
import { Course } from './course/course.entity';
import { Lesson } from './lesson/lesson.entity';
import { Enrollment } from './enrollment/enrollment.entity';

@Module({
  imports: [
   
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'course_management_db',
      entities: [User, Course, Lesson, Enrollment],
      synchronize: true,
    }),
    UserModule,
    CourseModule,
    LessonModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
