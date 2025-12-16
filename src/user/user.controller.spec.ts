import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException } from '@nestjs/common';
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
    mockUserService.findOne.mockResolvedValue(mockUser);
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
  }); // T3: GET /:id (findOne) - ВИПРАВЛЕНО ДЛЯ STRYKER

  it('4. should call UserService.findOne with ID', async () => {
    // Передаємо рядок, оскільки ParseIntPipe не імітується
    await controller.findOne('1' as any); // Сервіс отримує рядок (бо Pipe не спрацював)
    expect(mockUserService.findOne).toHaveBeenCalledWith('1');
  }); // T4: PATCH /:id (update) - ВИПРАВЛЕНО ДЛЯ STRYKER

  it('5. should call UserService.update with ID and DTO', async () => {
    await controller.update('1' as any, updateDto);
    expect(mockUserService.update).toHaveBeenCalledWith('1', updateDto);
  }); // T5: DELETE /:id (remove) - ВИПРАВЛЕНО ДЛЯ STRYKER

  it('6. should call UserService.remove with ID', async () => {
    await controller.remove('1' as any);
    expect(mockUserService.remove).toHaveBeenCalledWith('1');
  }); // T6: Перевірка прокидання помилки

  it('7. should throw NotFoundException if service throws it', async () => {
    mockUserService.findOne.mockRejectedValue(
      new NotFoundException('Test not found'),
    );
    await expect(controller.findOne('99' as any)).rejects.toThrow(
      NotFoundException,
    );
  });
});
