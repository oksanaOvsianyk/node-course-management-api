import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../user/user.entity'; // Імпорт User
import { Lesson } from '../lesson/lesson.entity'; // Майбутній імпорт Lesson
import { Enrollment } from '../enrollment/enrollment.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  instructorId: number; // FK

  // Зв'язок N:1 (Багато курсів належать одному інструктору)
  @ManyToOne(() => User, (user) => user.courses)
  instructor: User | null;

  // Зв'язок 1:N (Один курс має багато уроків)
  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lessons: Lesson[];
  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Enrollment[];
}
