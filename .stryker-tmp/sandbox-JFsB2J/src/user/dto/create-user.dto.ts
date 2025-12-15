// @ts-nocheck

export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  role?: 'Student' | 'Instructor';
}
