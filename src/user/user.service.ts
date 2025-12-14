import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // <-- НОВИЙ ІМПОРТ
import { Repository } from 'typeorm'; // <-- НОВИЙ ІМПОРТ
import { User } from './user.entity'; // <-- ЗМІНА: Імпортуємо Entity, а не Interface
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  // 1. ВИДАЛИТИ: private users: User[] = [...] та private nextId = 400;

  // 2. ДОДАТИ: Ін'єкція репозиторію
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Роут 1: Створити користувача (POST)
  async create(createUserDto: CreateUserDto): Promise<User> {
    // <-- async
    // Створюємо екземпляр сутності
    const newUser = this.usersRepository.create(createUserDto);
    // Зберігаємо його у БД
    return this.usersRepository.save(newUser);
  }

  // Роут 2: Отримати список усіх користувачів (GET /)
  async findAll(): Promise<User[]> {
    // <-- async
    return this.usersRepository.find();
  }

  // Роут 3: Отримати профіль за ID (GET /:id)
  async findOne(id: number): Promise<User> {
    // <-- async
    // findOneBy - стандартний метод TypeORM
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Роут 4: Оновити профіль (PUT /:id)
  async update(id: number, updateData: Partial<User>): Promise<User> {
    // <-- async
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Оновлюємо властивості об'єкта та зберігаємо зміни
    Object.assign(user, updateData);
    return this.usersRepository.save(user);
  }

  // Роут 5: Видалити користувача (DELETE /:id)
  async remove(id: number): Promise<void> {
    // <-- async
    const result = await this.usersRepository.delete(id); // Використовуємо метод delete

    // TypeORM повертає affected: 0, якщо рядок не знайдено
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
