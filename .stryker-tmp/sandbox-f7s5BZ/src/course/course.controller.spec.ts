// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { Course } from './course.entity';

// Mock-дані
const mockCourse: Course = {
  id: 1,
  title: 'Test Course',
  description: 'Desc',
  instructorId: 1,
  lessons: [],
  instructor: null,
  enrollments: [],
};
const createDto = { title: 'New Course', description: 'New', instructorId: 1 };
const updateDto = { title: 'Updated' };

// Mock-сервіс для контролера
const mockCourseService = {
  findAll: jest.fn().mockResolvedValue([mockCourse]),
  findOne: jest.fn().mockResolvedValue(mockCourse),
  create: jest.fn().mockResolvedValue(mockCourse),
  update: jest.fn().mockResolvedValue({ ...mockCourse, ...updateDto }),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('CourseController', () => {
  let controller: CourseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        {
          provide: CourseService,
          useValue: mockCourseService,
        },
      ],
    }).compile();

    controller = module.get<CourseController>(CourseController);
    jest.clearAllMocks();
  });

  it('1. should be defined', () => {
    expect(controller).toBeDefined();
  });

  // T1: POST / (create)
  it('2. should call CourseService.create with DTO', async () => {
    await controller.create(createDto as any);
    expect(mockCourseService.create).toHaveBeenCalledWith(createDto);
  });

  // T2: GET / (findAll)
  it('3. should call CourseService.findAll and return courses', async () => {
    const result = await controller.findAll();
    expect(mockCourseService.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockCourse]);
  });

  // T3: GET /:id (findOne)
  it('4. should call CourseService.findOne with ID', async () => {
    const result = await controller.findOne(1);
    expect(mockCourseService.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockCourse);
  });

  // T4: PATCH /:id (update)
  it('5. should call CourseService.update with ID and DTO', async () => {
    await controller.update(1, updateDto);
    expect(mockCourseService.update).toHaveBeenCalledWith(1, updateDto);
  });

  // T5: DELETE /:id (remove)
  it('6. should call CourseService.remove with ID', async () => {
    await controller.remove(1);
    expect(mockCourseService.remove).toHaveBeenCalledWith(1);
  });
});
