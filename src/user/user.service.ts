import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // <-- НОВИЙ ІМПОРТ
import { Repository } from 'typeorm'; // <-- НОВИЙ ІМПОРТ
import { User } from './user.entity'; // <-- ЗМІНА: Імпортуємо Entity, а не Interface
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Роут 1: Створити користувача (POST)
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);

    return this.usersRepository.save(newUser);
  }

  // Роут 2: Отримати список усіх користувачів (GET /)
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // Роут 3: Отримати профіль за ID (GET /:id)
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Роут 4: Оновити профіль (PUT /:id)
  async update(id: number, updateData: Partial<User>): Promise<User> {
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
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
