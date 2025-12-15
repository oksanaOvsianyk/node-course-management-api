// @ts-nocheck
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Course } from '../course/course.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column()
  courseId: number; // FK

  // Зв'язок N:1 (Багато уроків належать одному курсу)
  @ManyToOne(() => Course, (course) => course.lessons)
  course: Course | null;
}
