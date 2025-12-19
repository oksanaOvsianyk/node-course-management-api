import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
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
      url: 'postgres://course_db_iw90_user:shZAV3wQJNCcaLHdp0omVyNhPTSwKBEv@dpg-d50seli4d50c73eti4og-a.virginia-postgres.render.com/course_db_iw90',
      entities: [User, Course, Lesson, Enrollment],
      synchronize: true,
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UserModule,
    CourseModule,
    LessonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
