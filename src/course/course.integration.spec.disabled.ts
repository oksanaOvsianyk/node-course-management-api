import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from './course.module';
import { Course } from './course.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // Додано для типізації

describe('Course Integration Tests', () => {
  let app: INestApplication;
  let courseRepository: Repository<Course>; // Виправлено: типізація замість any

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Course],
          synchronize: true,
        }),
        CourseModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Виправлено: отримання репозиторію з правильною типізацією
    courseRepository = moduleFixture.get<Repository<Course>>(
      getRepositoryToken(Course),
    );
  });

  beforeEach(async () => {
    // Виправлено: безпечний виклик query
    await courseRepository.query('DELETE FROM course;');
  });

  it('/api/v1/courses (POST) should create a course', async () => {
    const newCourse = {
      title: 'Test Integr. Course',
      description: 'desc',
      instructorId: 1,
    };

    await request(app.getHttpServer())
      .post('/api/v1/courses')
      .send(newCourse)
      .expect(201)
      .expect((res: { body: { title: string; id: number } }) => {
        // Виправлено: типізація аргументу res для усунення помилок member access
        expect(res.body.title).toEqual(newCourse.title);
        expect(res.body.id).toBeDefined();
      });
  });

  it('/api/v1/courses (GET) should return an array of courses', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/courses')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  afterAll(async () => {
    await app.close();
  });
});
