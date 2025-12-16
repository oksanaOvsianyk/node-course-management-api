import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, DeleteResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  // 1. Mock-дані з явною типізацією User
  const mockUser = {
    id: 1,
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    role: 'Student',
    courses: [],
    enrollments: [],
  } as User;

  const mockUsers: User[] = [mockUser];

  const createUserDto: CreateUserDto = {
    firstName: 'New',
    lastName: 'User',
    email: 'new@example.com',
    role: 'Student',
  };

  const updateData = { lastName: 'Updated' };

  // 2. Mock-репозиторій з типізованими методами
  const mockRepository = {
    find: jest.fn().mockResolvedValue(mockUsers),
    findOneBy: jest.fn().mockResolvedValue(mockUser),
    // ВИПРАВЛЕНО: додано типізацію входу (CreateUserDto) та виходу (User)
    create: jest
      .fn()
      .mockImplementation((dto: CreateUserDto): User => dto as User),
    save: jest.fn().mockResolvedValue(mockUser),
    delete: jest.fn(),
  };

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
    // ВИПРАВЛЕНО: типізоване отримання репозиторію для усунення unsafe-assignment
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should create a user', async () => {
    // ВИПРАВЛЕНО: прибрано 'as any'
    const result = await service.create(createUserDto);
    expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  it('should return all users', async () => {
    const result = await service.findAll();
    expect(mockRepository.find).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });

  it('should return a single user by id', async () => {
    const result = await service.findOne(1);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user is not found', async () => {
    // ВИПРАВЛЕНО: використання spyOn для безпечної зміни поведінки мока
    jest.spyOn(mockRepository, 'findOneBy').mockResolvedValueOnce(null);
    await expect(service.findOne(99)).rejects.toThrow(
      'User with ID 99 not found',
    );
  });

  it('should update a user', async () => {
    jest.spyOn(mockRepository, 'findOneBy').mockResolvedValueOnce(mockUser);
    jest
      .spyOn(mockRepository, 'save')
      .mockResolvedValueOnce({ ...mockUser, ...updateData } as User);

    const result = await service.update(1, updateData);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockRepository.save).toHaveBeenCalled();
    expect(result.lastName).toEqual('Updated');
  });

  it('should remove a user successfully', async () => {
    jest
      .spyOn(mockRepository, 'delete')
      .mockResolvedValueOnce({ affected: 1, raw: [] } as DeleteResult);
    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(mockRepository.delete).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if no user was deleted', async () => {
    jest
      .spyOn(mockRepository, 'delete')
      .mockResolvedValueOnce({ affected: 0, raw: [] } as DeleteResult);
    await expect(service.remove(99)).rejects.toThrow(
      'User with ID 99 not found',
    );
  });
});
