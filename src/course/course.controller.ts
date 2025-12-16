import {
  Controller,
  Get,
  Post,
  Put, // <-- Додано
  Delete, // <-- Додано
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from './course.entity'; // <-- ЗМІНА: Імпортуємо Entity замість Interface

@Controller('api/v1/courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  // Роут 1: POST /api/v1/courses (Створення курсу)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    // <-- Додано async
    return this.courseService.create(createCourseDto);
  }

  // Роут 2: GET /api/v1/courses (Список курсів)
  @Get()
  async findAll(): Promise<Course[]> {
    // <-- Додано async
    return this.courseService.findAll();
  }

  // Роут 3: GET /api/v1/courses/:id (Деталі курсу)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Course> {
    // <-- Додано async
    return this.courseService.findOne(id);
  }

  // Роут 4: PUT /api/v1/courses/:id (Оновлення курсу)
  @Put(':id')
  async update(
    // <-- Додано async
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Course>,
  ): Promise<Course> {
    return this.courseService.update(id, updateData);
  }

  // Роут 5: DELETE /api/v1/courses/:id (Видалення курсу)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    // <-- Додано async
    return this.courseService.remove(id);
  }
}
