import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CourseService } from './course.service';
import type { Course } from './interfaces/course.interface';
import { CreateCourseDto } from './dto/create-course.dto';

@Controller('api/v1/courses') // Базовий маршрут
export class CourseController {
  constructor(private courseService: CourseService) {}

  // Роут 1: POST /api/v1/courses (Створення курсу)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCourseDto: CreateCourseDto): Course {
    return this.courseService.create(createCourseDto);
  }

  // Роут 2: GET /api/v1/courses (Список курсів)
  @Get()
  findAll(): Course[] {
    return this.courseService.findAll();
  }

  // Роут 3: GET /api/v1/courses/:id (Деталі курсу)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Course {
    return this.courseService.findOne(id);
  }
}
