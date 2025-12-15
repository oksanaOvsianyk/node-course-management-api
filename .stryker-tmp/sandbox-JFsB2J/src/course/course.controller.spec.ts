// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseService } from './course.service'; 

const mockCourseService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Додайте тут тест, що перевіряє, чи викликається findAll у контролері
  it('should call findAll method of CourseService', () => {
    controller.findAll();
    expect(mockCourseService.findAll).toHaveBeenCalled();
  });
});
