import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

interface TestResponse {
  id: number;
  email?: string;
  title?: string;
  instructor?: { id: number };
  lessons?: any[];
}

describe('E2E Test Suite (e2e)', () => {
  let app: INestApplication;
  const baseUrl = '/api/v1';

  let instructorId: number;
  let courseId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // Тест 1: Створення Інструктора
  it(`${baseUrl}/users (POST) - Create Instructor`, () => {
    const instructorData = {
      firstName: 'Test',
      lastName: 'Instructor',
      email: 'e2e.test@edu.com',
      role: 'Instructor',
    };
    return request(app.getHttpServer())
      .post(`${baseUrl}/users`)
      .send(instructorData)
      .expect(201)
      .expect((res: { body: TestResponse }) => {
        instructorId = res.body.id; // Зберігаємо в локальну змінну
        expect(res.body.email).toEqual(instructorData.email);
      });
  });

  // Тест 2: Створення Курсу
  it(`${baseUrl}/courses (POST) - Create Course and check relations`, () => {
    const courseData = {
      title: 'E2E Course',
      description: 'Full system test',
      instructorId: instructorId,
    };
    return request(app.getHttpServer())
      .post(`${baseUrl}/courses`)
      .send(courseData)
      .expect(201)
      .expect((res: { body: TestResponse }) => {
        courseId = res.body.id;
        expect(res.body.title).toEqual(courseData.title);
      });
  });

  // Тест 3: Створення Уроку
  it(`${baseUrl}/lessons (POST) - Create Lesson`, () => {
    const lessonData = {
      title: 'E2E Lesson 1',
      content: 'Content',
      courseId: courseId,
    };
    return request(app.getHttpServer())
      .post(`${baseUrl}/lessons`)
      .send(lessonData)
      .expect(201)
      .expect((res: { body: TestResponse }) => {
        expect(res.body.title).toEqual(lessonData.title);
      });
  });

  // Тест 4: Перевірка Зв'язків
  it(`${baseUrl}/courses/:id (GET) - Check relations (Lessons, Instructor)`, () => {
    return request(app.getHttpServer())
      .get(`${baseUrl}/courses/${courseId}`)
      .expect(200)
      .expect((res: { body: TestResponse }) => {
        // Додаємо перевірку на існування об'єктів перед доступом до них
        expect(res.body.instructor?.id).toEqual(instructorId);
        expect(res.body.lessons).toHaveLength(1);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
