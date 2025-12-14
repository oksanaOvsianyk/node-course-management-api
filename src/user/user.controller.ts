import {
  Controller,
  Get,
  Post,
  Put,
  Delete, // Додано Delete
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import type { User } from './interfaces/user.interface';
@Controller('api/v1/users') // Базовий маршрут
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Роут 1: POST /api/v1/users (Створення)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): User {
    return this.userService.create(createUserDto);
  }

  // Роут 2: GET /api/v1/users (Отримати список всіх користувачів)
  @Get()
  findAll(): User[] {
    return this.userService.findAll();
  }

  // Роут 3: GET /api/v1/users/:id (Отримати профіль)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): User {
    return this.userService.findOne(id);
  }

  // Роут 4: PUT /api/v1/users/:id (Оновити профіль)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<User>,
  ): User {
    return this.userService.update(id, updateData);
  }

  // Роут 5: DELETE /api/v1/users/:id (Видалити користувача)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content при успішному видаленні
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.userService.remove(id);
  }
}
