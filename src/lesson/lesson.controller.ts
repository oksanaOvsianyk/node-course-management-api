import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Lesson } from './lesson.entity'; 
@Controller('api/v1/lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createLessonDto: CreateLessonDto): Promise<Lesson> {
    return this.lessonService.create(createLessonDto);
  }

  @Get()
  async findAll(): Promise<Lesson[]> {
    return this.lessonService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Lesson> {
    return this.lessonService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<Lesson>,
  ): Promise<Lesson> {
    return this.lessonService.update(id, updateData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.lessonService.remove(id);
  }
}
