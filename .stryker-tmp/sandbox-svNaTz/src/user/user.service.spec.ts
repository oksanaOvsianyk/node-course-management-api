// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

// 1. Mock-дані
const mockUser: User = {
  id: 1,
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  role: 'Student',
  courses: [],
  enrollments: [],
};
const mockUsers: User[] = [mockUser];
const createUserDto = {
  firstName: 'New',
  lastName: 'User',
  email: 'new@example.com',
  role: 'Student',
};
const updateData = { lastName: 'Updated' };

// 2. Mock-репозиторій: Заглушка для TypeORM Repository
const mockRepository: Partial<Repository<User>> = {
  find: jest.fn().mockResolvedValue(mockUsers),
  findOneBy: jest.fn(), // Ініціалізуємо як jest.fn() для контролю
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
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
    jest.clearAllMocks();

    // Налаштовуємо стандартні повернення, які можна перевизначити в конкретних тестах
    (mockRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);
    (mockRepository.save as jest.Mock).mockResolvedValue(mockUser);
    (mockRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });
  });

  it('1. should be defined', () => {
    expect(service).toBeDefined();
  });

  // T1: Створення
  it('2. should create a user', async () => {
    const result = await service.create(createUserDto as any);
    expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  // T2: Отримання всіх
  it('3. should return all users', async () => {
    const result = await service.findAll();
    expect(mockRepository.find).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });

  // T3: Отримання за ID (Успіх)
  it('4. should return a single user by id', async () => {
    const result = await service.findOne(1);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(mockUser);
  });

  // T4: Отримання за ID (Невдача) - Перевірка повного повідомлення
  it('5. should throw NotFoundException if user is not found (findOne)', async () => {
    (mockRepository.findOneBy as jest.Mock).mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(
      'User with ID 99 not found',
    );
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 99 });
  });

  // T5: Оновлення (Успіх) - Об'єднано T5 та T6
  it('6. should update a user and return the updated version', async () => {
    const updatedUser = { ...mockUser, ...updateData };
    (mockRepository.save as jest.Mock).mockResolvedValue(updatedUser);

    const result = await service.update(1, updateData);

    // Перевірка, що виклик пошуку був з правильним ID (ВИПРАВЛЯЄ SURVIVED MUTANT)
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.lastName).toEqual('Updated');
  });

  // T6: Оновлення (Невдача) - ВИПРАВЛЕНО FAIL DRY RUN
  it('7. should throw NotFoundException on update if user not found', async () => {
    (mockRepository.findOneBy as jest.Mock).mockResolvedValue(null);

    // Перевірка виклику повинна бути перед очікуванням винятку
    // Оскільки метод service.update спочатку викликає findOneBy
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 99 });

    // Після перевірки очікуємо виняток
    await expect(service.update(99, updateData)).rejects.toThrow(
      'User with ID 99 not found',
    );
    // Додаткова перевірка: save не викликався
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  // T7: Видалення (Успіх) - ДОДАНО
  it('8. should delete a user successfully', async () => {
    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  // T8: Видалення (Невдача) - ДОДАНО
  it('9. should throw NotFoundException if no user was deleted (affected: 0)', async () => {
    (mockRepository.delete as jest.Mock).mockResolvedValue({ affected: 0 }); // Нічого не видалено
    await expect(service.remove(99)).rejects.toThrow(
      'User with ID 99 not found',
    );
    expect(mockRepository.delete).toHaveBeenCalledWith(99);
  });
});
