import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  private users: User[] = [
    {
      id: 101,
      firstName: 'Anna',
      lastName: 'Kovalenko',
      email: 'anna@example.com',
      role: 'Instructor',
    },
    {
      id: 201,
      firstName: 'Bohdan',
      lastName: 'Ivanchenko',
      email: 'bohdan@example.com',
      role: 'Student',
    },
    {
      id: 301,
      firstName: 'Olena',
      lastName: 'Petrenko',
      email: 'olena@example.com',
      role: 'Student',
    },
  ];
  private nextId = 400; // Лічильник для нових ID

  // Роут 1: Створити користувача (POST)
  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      id: this.nextId++,
      ...createUserDto,
      role: createUserDto.role || 'Student',
    };
    this.users.push(newUser);
    return newUser;
  }

  // Роут 2: Отримати профіль за ID (GET /:id)
  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Роут 3: Оновити профіль (PUT /:id)
  update(id: number, updateData: Partial<User>): User {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.users[index] = { ...this.users[index], ...updateData };
    return this.users[index];
  }
}
