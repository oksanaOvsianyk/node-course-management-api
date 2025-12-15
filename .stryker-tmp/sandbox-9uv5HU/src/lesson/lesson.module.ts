// @ts-nocheck
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { Lesson } from './lesson.entity'; // <-- Імпорт сутності

@Module({
  imports: [
    // Реєструємо Lesson Entity
    TypeOrmModule.forFeature([Lesson]),
  ],
  controllers: [LessonController],
  providers: [LessonService],
})
export class LessonModule {}
