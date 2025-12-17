import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonService {
  
  constructor(
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
  ) {}

  // 1. Створити урок (POST)
  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const newLesson = this.lessonsRepository.create(createLessonDto);
    return this.lessonsRepository.save(newLesson);
  }

  // 2. Отримати список усіх уроків (GET /)
  async findAll(): Promise<Lesson[]> {
    return this.lessonsRepository.find({ relations: ['course'] });
  }

  // 3. Отримати урок за ID (GET /:id)
  async findOne(id: number): Promise<Lesson> {
    const lesson = await this.lessonsRepository.findOne({
      where: { id },
      relations: ['course'],
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  // 4. Оновити урок (PUT /:id)
  async update(id: number, updateData: Partial<Lesson>): Promise<Lesson> {
    const lesson = await this.lessonsRepository.findOneBy({ id });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }

    Object.assign(lesson, updateData);
    return this.lessonsRepository.save(lesson);
  }

  // 5. Видалити урок (DELETE /:id)
  async remove(id: number): Promise<void> {
    const result = await this.lessonsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
  }
}
