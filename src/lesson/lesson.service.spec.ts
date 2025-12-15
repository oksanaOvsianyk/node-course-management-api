import { Test, TestingModule } from '@nestjs/testing';
import { LessonService } from './lesson.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

// Mock-дані
const mockLesson: Lesson = {
  id: 1,
  title: 'Test Lesson',
  content: 'Content',
  courseId: 1,
  course: null,
};
const mockLessons: Lesson[] = [mockLesson];
const createLessonDto = {
  title: 'New Lesson',
  content: 'New Content',
  courseId: 1,
};
const updateData = { title: 'Updated Title' };

// Mock-репозиторій
const mockRepository: Partial<Repository<Lesson>> = {
  find: jest.fn().mockResolvedValue(mockLessons),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn().mockImplementation((dto) => ({ id: 99, ...dto })),
  save: jest.fn().mockResolvedValue(mockLesson),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
};

describe('LessonService', () => {
  let service: LessonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonService,
        {
          provide: getRepositoryToken(Lesson),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LessonService>(LessonService);
    jest.clearAllMocks();

    // Скидаємо mock-повернення перед кожним тестом, де це необхідно
    mockRepository.findOne = jest.fn().mockResolvedValue(mockLesson);
    mockRepository.findOneBy = jest.fn().mockResolvedValue(mockLesson);
    mockRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });
  });

  it('1. should be defined', () => {
    expect(service).toBeDefined();
  });

  // T1: Створення
  it('2. should create a lesson and call save', async () => {
    const result = await service.create(createLessonDto as any);
    expect(mockRepository.create).toHaveBeenCalledWith(createLessonDto);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(mockLesson);
  });

  // T2: Отримання всіх (з зв'язком 'course')
  it('3. should return all lessons with relations', async () => {
    const result = await service.findAll();
    expect(mockRepository.find).toHaveBeenCalledWith({ relations: ['course'] });
    expect(result).toEqual(mockLessons);
  });

  // T3: Отримання за ID (Успіх)
  it('4. should return a single lesson by id with relations', async () => {
    const result = await service.findOne(1);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['course'],
    });
    expect(result).toEqual(mockLesson);
  });

  // T4: Отримання за ID (Невдача)
  it('5. should throw NotFoundException if lesson is not found (findOne)', async () => {
    mockRepository.findOne = jest.fn().mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(
      'Lesson with ID 99 not found',
    );
  });

  // T5: Оновлення (Успіх)
  it('6. should update a lesson', async () => {
    mockRepository.findOneBy = jest.fn().mockResolvedValue(mockLesson);
    mockRepository.save = jest
      .fn()
      .mockResolvedValue({ ...mockLesson, ...updateData });

    const result = await service.update(1, updateData);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.title).toEqual('Updated Title');
  });

  // T6: Оновлення (Невдача)
  it('7. should throw NotFoundException on update if lesson not found', async () => {
    mockRepository.findOneBy = jest.fn().mockResolvedValue(null);
    await expect(service.update(99, updateData)).rejects.toThrow(
      'Lesson with ID 99 not found',
    );
  });

  // T7: Видалення (Успіх)
  it('8. should remove a lesson successfully', async () => {
    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  // T8: Видалення (Невдача)
  it('9. should throw NotFoundException if no lesson was deleted (affected: 0)', async () => {
    mockRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });
    await expect(service.remove(99)).rejects.toThrow(
      'Lesson with ID 99 not found',
    );
  });
});
