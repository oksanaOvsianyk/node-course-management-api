// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException, ParseIntPipe } from '@nestjs/common';
import { User } from '../user/user.entity';

// Mock-дані
const mockUser: User = {
  id: 1,
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  role: 'Student',
  courses: [],
  enrollments: [],
};
const createUserDto = {
  firstName: 'New',
  lastName: 'User',
  email: 'a@b.com',
  role: 'Student',
};
const updateDto = { lastName: 'Updated' };

// Mock-сервіс: Заглушка для UserService
const mockUserService = {
  findAll: jest.fn().mockResolvedValue([mockUser]),
  findOne: jest.fn().mockResolvedValue(mockUser),
  create: jest.fn().mockResolvedValue(mockUser),
  update: jest.fn().mockResolvedValue({ ...mockUser, ...updateDto }),
  remove: jest.fn().mockResolvedValue(undefined),
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    jest.clearAllMocks();
    // Скидання mock-повернень для T6
    (mockUserService.findOne as jest.Mock).mockResolvedValue(mockUser);
  });

  it('1. should be defined', () => {
    expect(controller).toBeDefined();
  }); // T1: POST / (create)

  it('2. should call UserService.create with DTO', async () => {
    await controller.create(createUserDto as any);
    expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
  }); // T2: GET / (findAll)

  it('3. should call UserService.findAll and return users', async () => {
    const result = await controller.findAll();
    expect(mockUserService.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockUser]);
  }); // T3: GET /:id (findOne) - ВИПРАВЛЕНО

  it('4. should call UserService.findOne with ID', async () => {
    // Передаємо рядок, оскільки ParseIntPipe не імітується у цьому модулі тестування
    await controller.findOne('1' as any); // Передаємо рядок '1' як any
    expect(mockUserService.findOne).toHaveBeenCalledWith(1); // Але очікуємо, що сервіс отримає число 1
  }); // T4: PATCH /:id (update) - ВИПРАВЛЕНО

  it('5. should call UserService.update with ID and DTO', async () => {
    await controller.update('1' as any, updateDto);
    expect(mockUserService.update).toHaveBeenCalledWith(1, updateDto);
  }); // T5: DELETE /:id (remove) - ВИПРАВЛЕНО

  it('6. should call UserService.remove with ID', async () => {
    await controller.remove('1' as any);
    expect(mockUserService.remove).toHaveBeenCalledWith(1);
  }); // T6: Перевірка прокидання помилки - ВИПРАВЛЕНО

  it('7. should throw NotFoundException if service throws it', async () => {
    // Налаштовуємо mock, щоб він кинув виняток
    (mockUserService.findOne as jest.Mock).mockRejectedValue(
      new NotFoundException('Test not found'),
    ); // Очікуємо, що контролер прокине цей виняток. Передаємо рядок.

    await expect(controller.findOne('99' as any)).rejects.toThrow(
      NotFoundException,
    );
  });
});
