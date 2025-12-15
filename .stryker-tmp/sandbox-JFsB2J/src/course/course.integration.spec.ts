// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from './course.module';
import { Course } from './course.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

// Заглушки для інших модулів, якщо вони не потрібні в тесті
// (Це спрощений інтеграційний тест, що покриває лише CourseModule та його БД)

describe('Course Integration Tests', () => {
  let app: INestApplication;
  let courseRepository: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // ВИКОРИСТАННЯ ТЕСТОВОЇ БД (sqlite in-memory або іншої)
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:', // База даних в пам'яті для швидких тестів
          entities: [Course], // Додайте всі сутності, які ви тестуєте
          synchronize: true,
        }),
        CourseModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Отримання репозиторію для очищення даних між тестами
    courseRepository = moduleFixture.get(getRepositoryToken(Course));
  });

  // Очищення даних перед кожним тестом
  beforeEach(async () => {
    await courseRepository.query('DELETE FROM course;');
  });

  // Тест 1: POST /api/v1/courses (Створення та перевірка в БД)
  it('/api/v1/courses (POST) should create a course', async () => {
    const newCourse = {
      title: 'Test Integr. Course',
      description: 'desc',
      instructorId: 1,
    };

    // ⚠️ Тут потрібно також додати логіку створення Інструктора, оскільки є instructorId: 1
    // (Це ускладнює, тому для ЛР №5 сфокусуйтеся на найпростішому: перевірка, що роут працює)

    await request(app.getHttpServer())
      .post('/api/v1/courses')
      .send(newCourse)
      .expect(201)
      .expect((res) => {
        expect(res.body.title).toEqual(newCourse.title);
        expect(res.body.id).toBeDefined();
      });
  });

  // Тест 2: GET /api/v1/courses (Перевірка даних)
  it('/api/v1/courses (GET) should return an array of courses', async () => {
    // Припускаємо, що ми створили курс перед цим
    const response = await request(app.getHttpServer())
      .get('/api/v1/courses')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  afterAll(async () => {
    await app.close();
  });
});
