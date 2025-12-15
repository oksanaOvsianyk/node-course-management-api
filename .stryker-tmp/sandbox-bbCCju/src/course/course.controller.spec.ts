// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { Course } from './course.entity';
import { NotFoundException } from '@nestjs/common';

// 1. Mock-дані
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

// 2. Mock-сервіс: Заглушка для CourseService
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

    (mockCourseService.findOne as jest.Mock).mockResolvedValue(mockCourse);
    (mockCourseService.update as jest.Mock).mockResolvedValue({
      ...mockCourse,
      ...updateDto,
    });
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

  // T3: GET /:id (findOne) - ВИПРАВЛЕНО ДЛЯ STRYKER
  it('4. should call CourseService.findOne with ID (string)', async () => {
    await controller.findOne('1' as any);
    // Сервіс отримує рядок, оскільки ParseIntPipe не імітується
    expect(mockCourseService.findOne).toHaveBeenCalledWith('1');
  });

  // T4: PATCH /:id (update) - ВИПРАВЛЕНО ДЛЯ STRYKER
  it('5. should call CourseService.update with ID and DTO', async () => {
    await controller.update('1' as any, updateDto);
    expect(mockCourseService.update).toHaveBeenCalledWith('1', updateDto);
  });

  // T5: DELETE /:id (remove) - ВИПРАВЛЕНО ДЛЯ STRYKER
  it('6. should call CourseService.remove with ID', async () => {
    await controller.remove('1' as any);
    expect(mockCourseService.remove).toHaveBeenCalledWith('1');
  });

  // T6: Перевірка прокидання помилки
  it('7. should throw NotFoundException if service throws it', async () => {
    (mockCourseService.findOne as jest.Mock).mockRejectedValue(
      new NotFoundException('Course not found'),
    );
    await expect(controller.findOne('99' as any)).rejects.toThrow(
      NotFoundException,
    );
  });
});
