// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { NotFoundException } from '@nestjs/common';

// 1. Імітаційні дані
const mockCourse: Course = {
  id: 1,
  title: 'Test Course',
  description: 'A course for testing',
  instructorId: 1,
  lessons: [], // Порожній масив для зв'язку
  instructor: null,
  enrollments: [],
};
const mockCourses: Course[] = [mockCourse];
const createCourseDto = {
  title: 'New Course',
  description: 'New',
  instructorId: 1,
};
const updateCourseDto = { title: 'Updated Course Title' };

// 2. Імітація репозиторію
const mockRepository = {
  find: jest.fn().mockResolvedValue(mockCourses),
  findOne: jest.fn().mockResolvedValue(mockCourse),
  findOneBy: jest.fn().mockResolvedValue(mockCourse),
  create: jest.fn().mockImplementation((dto) => dto), // Імітує створення
  save: jest.fn().mockResolvedValue(mockCourse),
  delete: jest.fn().mockResolvedValue({ affected: 1 }), // Успішне видалення
};

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
  });

  // Тест 1: Перевірка, що сервіс визначено (вже є)
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- CRUD ТЕСТИ ---

  // Тест 2: Створення курсу
  it('should create a course and return it', async () => {
    const result = await service.create(createCourseDto as any);
    expect(mockRepository.create).toHaveBeenCalledWith(createCourseDto);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(mockCourse);
  });

  // Тест 3: Отримання всіх курсів
  it('should return an array of courses', async () => {
    const result = await service.findAll();
    expect(mockRepository.find).toHaveBeenCalledWith({
      relations: ['instructor'],
    });
    expect(result).toEqual(mockCourses);
  });

  // Тест 4: Отримання курсу за ID (Успіх)
  it('should return a single course by id', async () => {
    const result = await service.findOne(1);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['instructor', 'lessons'],
    });
    expect(result).toEqual(mockCourse);
  });

  // Тест 5: Отримання курсу за ID (Невдача)
  it('should throw a NotFoundException if findOne returns null', async () => {
    // Налаштовуємо репозиторій, щоб він повернув null
    mockRepository.findOne.mockResolvedValue(null);

    // Очікуємо, що метод кине виняток
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  // Тест 6: Оновлення курсу (Успіх)
  it('should update a course and return the updated version', async () => {
    mockRepository.findOneBy.mockResolvedValue(mockCourse);
    mockRepository.save.mockResolvedValue({
      ...mockCourse,
      ...updateCourseDto,
    });

    const result = await service.update(1, updateCourseDto);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.title).toEqual('Updated Course Title');
  });

  // Тест 7: Оновлення курсу (Невдача)
  it('should throw a NotFoundException on update if course not found', async () => {
    mockRepository.findOneBy.mockResolvedValue(null); // Не знайдено
    await expect(service.update(99, updateCourseDto)).rejects.toThrow(
      NotFoundException,
    );
  });

  // Тест 8: Видалення курсу (Успіх)
  it('should delete a course successfully', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 1 });
    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  // Тест 9: Видалення курсу (Невдача)
  it('should throw a NotFoundException if no course was deleted (affected: 0)', async () => {
    mockRepository.delete.mockResolvedValue({ affected: 0 }); // Нічого не видалено
    await expect(service.remove(99)).rejects.toThrow(NotFoundException);
  });
});
