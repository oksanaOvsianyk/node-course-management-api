// @ts-nocheck
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Course } from '../course/course.entity';

@Entity('enrollments')
@Unique(['studentId', 'courseId']) // Забезпечує, що студент не може бути двічі зарахований на той самий курс
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number; // FK до User

  @Column()
  courseId: number; // FK до Course

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  enrollmentDate: Date;

  // Зв'язок N:1: Зв'язок із User (Студент)
  @ManyToOne(() => User, (user) => user.enrollments)
  student: User;

  // Зв'язок N:1: Зв'язок із Course
  @ManyToOne(() => Course, (course) => course.enrollments)
  course: Course;
}
