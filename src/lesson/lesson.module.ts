import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { Lesson } from './lesson.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson]),
  ],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
