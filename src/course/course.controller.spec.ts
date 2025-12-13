import { Test, TestingModule } from '@nestjs/testing';
import { CourseController } from './course.controller';
import { CourseService } from './course.service'; // Імпортуємо реальний сервіс

// 1. Оголошуємо мок-клас для сервісу
const mockCourseService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  // Додайте тут інші методи, які викликає контролер (create, update, remove)
};

describe('CourseController', () => {
  let controller: CourseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseController],
      providers: [
        // 2. Замінюємо реальний CourseService мок-об'єктом
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
