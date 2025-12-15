// @ts-nocheck
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
  // Вважаємо, що Lesson.course має бути Course | null
  course: null,
};
const mockLessons: Lesson[] = [mockLesson];
const createLessonDto = {
  title: 'New Lesson',
  content: 'New Content',
  courseId: 1,
};
const updateData = { title: 'Updated Title' };

// Mock-репозиторій: Використовуємо Partial<Repository<Lesson>>
const mockRepository: Partial<Repository<Lesson>> = {
  find: jest.fn().mockResolvedValue(mockLessons),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn().mockImplementation((dto) => ({ id: 99, ...dto })),
  save: jest.fn(),
  delete: jest.fn(),
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
    jest.clearAllMocks(); // Очищаємо всі виклики перед кожним тестом

    // Налаштування стандартних повернень для більшості тестів
    (mockRepository.findOne as jest.Mock).mockResolvedValue(mockLesson);
    (mockRepository.findOneBy as jest.Mock).mockResolvedValue(mockLesson);
    (mockRepository.save as jest.Mock).mockResolvedValue(mockLesson);
    (mockRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });
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

  // T2: Отримання всіх
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
    (mockRepository.findOne as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(
      'Lesson with ID 99 not found',
    );
    // Перевірка, що виклик був з правильним ID
    expect(mockRepository.findOne).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 99 } }),
    );
  });

  // T5: Оновлення (Успіх) - ВИПРАВЛЕНО SURVIVED MUTANT
  it('6. should update a lesson successfully', async () => {
    // mockRepository.findOneBy налаштовано на повернення mockLesson у beforeEach
    const updatedLesson = { ...mockLesson, ...updateData };
    (mockRepository.save as jest.Mock).mockResolvedValue(updatedLesson);

    const result = await service.update(1, updateData);

    // ПЕРЕВІРКА, ЩО ПОШУК БУВ ЗА ПРАВИЛЬНИМ ID (ВИПРАВЛЯЄ SURVIVED MUTANT)
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });

    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.title).toEqual('Updated Title');
  });

  // T6: Оновлення (Невдача) - ВИПРАВЛЕНО FAIL DRY RUN
  it('7. should throw NotFoundException on update if lesson not found', async () => {
    // Налаштування для цього конкретного тесту
    (mockRepository.findOneBy as jest.Mock).mockResolvedValue(null);

    // Ми очікуємо виняток перед перевіркою toHaveBeenCalled
    await expect(service.update(99, updateData)).rejects.toThrow(
      'Lesson with ID 99 not found',
    );

    // ПЕРЕВІРКА, ЩО ПОШУК БУВ ВИКЛИКАНИЙ (ЦЕ БУЛА ПРИЧИНА ПОМИЛКИ DRY RUN)
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 99 });
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  // T7: Видалення (Успіх)
  it('8. should remove a lesson successfully', async () => {
    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  // T8: Видалення (Невдача)
  it('9. should throw NotFoundException if no lesson was deleted (affected: 0)', async () => {
    (mockRepository.delete as jest.Mock).mockResolvedValue({ affected: 0 });
    await expect(service.remove(99)).rejects.toThrow(
      'Lesson with ID 99 not found',
    );
    expect(mockRepository.delete).toHaveBeenCalledWith(99);
  });
});
