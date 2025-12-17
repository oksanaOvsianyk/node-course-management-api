import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Course } from '../course/course.entity'; // Майбутній імпорт
import { Enrollment } from '../enrollment/enrollment.entity';

@Entity('users') // Назва таблиці у PostgreSQL
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: 'Student' })
  role: string;

  // Зв'язок 1:N (Викладач може мати багато курсів)
  @OneToMany(() => Course, (course) => course.instructor)
  courses: Course[];
  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];
}
