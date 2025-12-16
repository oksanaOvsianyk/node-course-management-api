import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity'; // Імпорт створеної сутності

@Module({
  imports: [
    // Реєстрація сутності User, щоб її Репозиторій був доступний для ін'єкції
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
