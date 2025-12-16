import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Repository } from 'typeorm'; // Додано DeleteResult
import { CreateCourseDto } from './dto/create-course.dto';
import { User } from '../user/user.entity'; // Імпортуйте сутність User

// 1. Імітаційні дані
const mockCourse = {
  id: 1,
  title: 'Test Course',
  description: 'A course for testing',
  instructorId: 1,
  lessons: [],
  // ВИПРАВЛЕНО: використовуємо unknown для безпечного приведення типів без any
  instructor: null as unknown as User,
  enrollments: [],
} as Course;

const mockCourses: Course[] = [mockCourse];

const createCourseDto: CreateCourseDto = {
  title: 'New Course',
  description: 'New',
  instructorId: 1,
};

const updateCourseDto = { title: 'Updated Course Title' };

// 2. Імітація репозиторію
const mockRepository: Partial<Repository<Course>> = {
  find: jest.fn().mockResolvedValue(mockCourses),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  // ВИПРАВЛЕНО: додано повернення типу Course
  create: jest
    .fn()
    .mockImplementation((dto: CreateCourseDto): Course => dto as Course),
  save: jest.fn().mockResolvedValue(mockCourse),
  delete: jest.fn(),
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
    jest.clearAllMocks();

    mockRepository.findOne = jest.fn().mockResolvedValue(mockCourse);
    mockRepository.findOneBy = jest.fn().mockResolvedValue(mockCourse);
    mockRepository.delete = jest
      .fn()
      .mockResolvedValue({ affected: 1, raw: [] });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- CRUD ТЕСТИ ---

  it('should create a course and return it', async () => {
    // ВИПРАВЛЕНО: видалено 'as any', використовуємо типізоване DTO
    const result = await service.create(createCourseDto);
    expect(mockRepository.create).toHaveBeenCalledWith(createCourseDto);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(mockCourse);
  });

  it('should return an array of courses', async () => {
    const result = await service.findAll();
    expect(mockRepository.find).toHaveBeenCalledWith({
      relations: ['instructor'],
    });
    expect(result).toEqual(mockCourses);
  });

  it('should return a single course by id', async () => {
    const result = await service.findOne(1);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['instructor', 'lessons'],
    });
    expect(result).toEqual(mockCourse);
  });

  it('should throw a NotFoundException if findOne returns null', async () => {
    mockRepository.findOne = jest.fn().mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(
      'Course with ID 99 not found',
    );
  });

  it('should update a course and return the updated version', async () => {
    mockRepository.findOneBy = jest.fn().mockResolvedValue(mockCourse);
    mockRepository.save = jest.fn().mockResolvedValue({
      ...mockCourse,
      ...updateCourseDto,
    } as Course);

    const result = await service.update(1, updateCourseDto);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.title).toEqual('Updated Course Title');
  });

  it('should throw a NotFoundException on update if course not found', async () => {
    mockRepository.findOneBy = jest.fn().mockResolvedValue(null);
    await expect(service.update(99, updateCourseDto)).rejects.toThrow(
      'Course with ID 99 not found',
    );
  });

  it('should delete a course successfully', async () => {
    mockRepository.delete = jest
      .fn()
      .mockResolvedValue({ affected: 1, raw: [] });
    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw a NotFoundException if no course was deleted (affected: 0)', async () => {
    mockRepository.delete = jest
      .fn()
      .mockResolvedValue({ affected: 0, raw: [] });
    await expect(service.remove(99)).rejects.toThrow(
      'Course with ID 99 not found',
    );
  });
});
