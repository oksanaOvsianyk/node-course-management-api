// DTO для вхідних даних при створенні користувача
export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  role?: 'Student' | 'Instructor';
}
