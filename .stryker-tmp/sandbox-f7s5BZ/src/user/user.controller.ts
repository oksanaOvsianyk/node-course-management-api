// @ts-nocheck
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

import { User } from '../user/user.entity';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 1. POST /api/v1/users (Створення)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    // Додано async та змінено тип повернення на Promise<User>
    return this.userService.create(createUserDto);
  }

  // 2. GET /api/v1/users (Отримати список всіх користувачів)
  @Get()
  async findAll(): Promise<User[]> {
   
    return this.userService.findAll();
  }

  // 3. GET /api/v1/users/:id (Отримати профіль)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    
    return this.userService.findOne(id);
  }

  // 4. PUT /api/v1/users/:id (Оновити профіль)
  @Put(':id')
  async update(
    
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return this.userService.update(id, updateData);
  }

  // 5. DELETE /api/v1/users/:id (Видалити користувача)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
   
    return this.userService.remove(id);
  }
}
