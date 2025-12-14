import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './interfaces/course.interface';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CourseService {
  
  private courses: Course[] = [
    {
      id: 1,
      title: 'Introduction to NestJS',
      description: 'Basics of NestJS.',
      instructorId: 101,
      lessonsCount: 5,
    },
    {
      id: 2,
      title: 'PostgreSQL for Beginners',
      description: 'SQL queries.',
      instructorId: 102,
      lessonsCount: 8,
    },
  ];
  private nextId = 3;

  // Роут 1: Створити курс (POST)
  create(createCourseDto: CreateCourseDto): Course {
    const newCourse: Course = {
      id: this.nextId++,
      ...createCourseDto,
      lessonsCount: 0,
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  // Роут 2: Список усіх курсів (GET)
  findAll(): Course[] {
    return this.courses;
  }

  // Роут 3: Деталі курсу за ID (GET /:id)
  findOne(id: number): Course {
    const course = this.courses.find((c) => c.id === id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }
}
