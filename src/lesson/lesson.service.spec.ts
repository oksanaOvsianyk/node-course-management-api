import { Test, TestingModule } from '@nestjs/testing';
import { LessonService } from './lesson.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository, DeleteResult } from 'typeorm';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { Course } from '../course/course.entity'; // Імпортуємо Course для типізації

describe('LessonService', () => {
  let service: LessonService;
  let repository: Repository<Lesson>;

  // 1. Створюємо мок-об'єкт з явною типізацією Lesson
  const mockLesson = {
    id: 1,
    title: 'Test Lesson',
    content: 'Content',
    courseId: 1,
    course: null as unknown as Course, // Виправлено: уникаємо any через unknown
  } as Lesson;

  const mockLessons: Lesson[] = [mockLesson];

  const createLessonDto: CreateLessonDto = {
    title: 'New Lesson',
    content: 'New Content',
    courseId: 1,
  };

  const updateData = { title: 'Updated Title' };

  // 2. Створюємо мок-репозиторій
  const mockRepository = {
    find: jest.fn().mockResolvedValue(mockLessons),
    findOne: jest.fn().mockResolvedValue(mockLesson),
    findOneBy: jest.fn().mockResolvedValue(mockLesson),
    create: jest.fn().mockImplementation((dto: CreateLessonDto): Lesson => {
      return { id: 99, ...dto } as Lesson;
    }),
    save: jest.fn().mockResolvedValue(mockLesson),
    delete: jest
      .fn()
      .mockResolvedValue({ affected: 1, raw: [] } as DeleteResult),
  };

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
    // Виправлено: додаємо типізацію для отримання репозиторію, щоб не було unsafe-assignment
    repository = module.get<Repository<Lesson>>(getRepositoryToken(Lesson));

    jest.clearAllMocks();
  });

  it('1. should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('2. should create a lesson and call save', async () => {
    // Тепер передаємо чисте DTO без 'as any'
    const result = await service.create(createLessonDto);
    expect(mockRepository.create).toHaveBeenCalledWith(createLessonDto);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(mockLesson);
  });

  it('3. should return all lessons with relations', async () => {
    const result = await service.findAll();
    expect(mockRepository.find).toHaveBeenCalledWith({ relations: ['course'] });
    expect(result).toEqual(mockLessons);
  });

  it('4. should return a single lesson by id with relations', async () => {
    const result = await service.findOne(1);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['course'],
    });
    expect(result).toEqual(mockLesson);
  });

  it('5. should throw NotFoundException if lesson is not found', async () => {
    jest.spyOn(mockRepository, 'findOne').mockResolvedValueOnce(null);
    await expect(service.findOne(99)).rejects.toThrow(
      'Lesson with ID 99 not found',
    );
  });

  it('6. should update a lesson', async () => {
    const updatedLesson = { ...mockLesson, ...updateData } as Lesson;
    jest.spyOn(mockRepository, 'save').mockResolvedValueOnce(updatedLesson);

    const result = await service.update(1, updateData);
    expect(result.title).toEqual('Updated Title');
  });

  it('7. should remove a lesson successfully', async () => {
    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  it('8. should throw NotFoundException if no lesson was deleted', async () => {
    jest
      .spyOn(mockRepository, 'delete')
      .mockResolvedValueOnce({ affected: 0, raw: [] } as DeleteResult);
    await expect(service.remove(99)).rejects.toThrow(
      'Lesson with ID 99 not found',
    );
  });
});
