import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 
import { Course } from './course.entity'; 
import { CreateCourseDto } from './dto/create-course.dto';


@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {}

  // Роут 1: Створити курс (POST)
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
   
    const newCourse = this.coursesRepository.create(createCourseDto);
    
    return this.coursesRepository.save(newCourse);
  }

  // Роут 2: Список усіх курсів (GET /)
  async findAll(): Promise<Course[]> {
    // Отримуємо всі курси, одразу завантажуючи пов'язаного інструктора
    return this.coursesRepository.find({
      relations: ['instructor'],
    });
  }

  // Роут 3: Деталі курсу за ID (GET /:id)
  async findOne(id: number): Promise<Course> {
    // <-- async
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['instructor', 'lessons'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }

  // Роут 4: Оновити курс (PUT /:id)
  async update(id: number, updateData: Partial<Course>): Promise<Course> {
   
    const course = await this.coursesRepository.findOneBy({ id });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    Object.assign(course, updateData);
    return this.coursesRepository.save(course);
  }

  // Роут 5: Видалити курс (DELETE /:id)
  async remove(id: number): Promise<void> {
    // <-- async
    const result = await this.coursesRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
  }
}
