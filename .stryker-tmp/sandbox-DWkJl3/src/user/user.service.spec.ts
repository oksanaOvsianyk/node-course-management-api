// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

// 1. Mock-дані
const mockUser: User = {
  id: 1,
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  role: 'Student',
  courses: [], // Зв'язок
  enrollments: [], // Зв'язок
};
const mockUsers: User[] = [mockUser];
const createUserDto = {
  firstName: 'New',
  lastName: 'User',
  email: 'new@example.com',
  role: 'Student',
};
const updateData = { lastName: 'Updated' };

// 2. Mock-репозиторій
const mockRepository = {
  find: jest.fn().mockResolvedValue(mockUsers),
  findOneBy: jest.fn().mockResolvedValue(mockUser),
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockResolvedValue(mockUser),
  delete: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    // Налаштування модуля тестування з mock-репозиторієм
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    // Скидаємо mock-виклики перед кожним тестом
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // T1: Створення
  it('should create a user', async () => {
    const result = await service.create(createUserDto as any);
    expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  // T2: Отримання всіх
  it('should return all users', async () => {
    const result = await service.findAll();
    expect(mockRepository.find).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });

  // T3: Отримання за ID (Успіх)
  it('should return a single user by id', async () => {
    const result = await service.findOne(1);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(mockUser);
  });

  // T4: Отримання за ID (Невдача) - ПЕРЕВІРКА ПОВІДОМЛЕННЯ
  it('should throw NotFoundException if user is not found', async () => {
    mockRepository.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(
      'User with ID 99 not found', // <-- Повний рядок
    );
  });

  // T5: Оновлення (Успіх)
  it('should update a user', async () => {
    mockRepository.findOneBy.mockResolvedValue(mockUser);
    mockRepository.save.mockResolvedValue({ ...mockUser, ...updateData });

    const result = await service.update(1, updateData);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.lastName).toEqual('Updated');
  });

  // T6: Оновлення (Успіх)
it('6. should update a user', async () => {
    // ...
    const result = await service.update(1, updateData);
    // ДОДАТИ ЦЮ ПЕРЕВІРКУ:
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 }); // <-- ФІКС
    // ...
});

// T7: Оновлення (Невдача)
it('7. should throw NotFoundException on update if user not found', async () => {
    mockRepository.findOneBy = jest.fn().mockResolvedValue(null); // <-- ОБОВ'ЯЗКОВО!
    // ДОДАТИ ЦЮ ПЕРЕВІРКУ:
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 99 }); // <-- ФІКС
    await expect(service.update(99, updateData)).rejects.toThrow(/* ... */);
});
});
