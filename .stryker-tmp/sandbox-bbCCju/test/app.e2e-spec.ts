// @ts-nocheck
// test/app.e2e-spec.ts

import request = require('supertest');
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';


describe('E2E Test Suite (e2e)', () => {
  let app: INestApplication;
  const baseUrl = '/api/v1'; // Ваш базовий префікс

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Імпортуємо весь додаток
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // --- E2E ТЕСТИ ---

  // Тест 1: Створення Інструктора (User Module E2E)
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
      .expect((res) => {
        global.instructorId = res.body.id; // Зберігаємо ID для подальших тестів
        expect(res.body.email).toEqual(instructorData.email);
      });
  });

  // Тест 2: Створення Курсу (Course Module E2E)
  it(`${baseUrl}/courses (POST) - Create Course and check relations`, () => {
    const courseData = {
      title: 'E2E Course',
      description: 'Full system test',
      instructorId: global.instructorId, // Використовуємо ID з попереднього тесту
    };
    return request(app.getHttpServer())
      .post(`${baseUrl}/courses`)
      .send(courseData)
      .expect(201)
      .expect((res) => {
        global.courseId = res.body.id; // Зберігаємо ID для подальших тестів
        expect(res.body.title).toEqual(courseData.title);
      });
  });

  // Тест 3: Створення Уроку (Lesson Module E2E)
  it(`${baseUrl}/lessons (POST) - Create Lesson`, () => {
    const lessonData = {
      title: 'E2E Lesson 1',
      content: 'Content',
      courseId: global.courseId,
    };
    return request(app.getHttpServer())
      .post(`${baseUrl}/lessons`)
      .send(lessonData)
      .expect(201)
      .expect((res) => {
        global.lessonId = res.body.id;
        expect(res.body.title).toEqual(lessonData.title);
      });
  });

  // Тест 4: Перевірка Зв'язків (Course GET E2E)
  it(`${baseUrl}/courses/:id (GET) - Check relations (Lessons, Instructor)`, () => {
    return request(app.getHttpServer())
      .get(`${baseUrl}/courses/${global.courseId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.instructor.id).toEqual(global.instructorId);
        expect(res.body.lessons).toHaveLength(1);
      });
  });

  afterAll(async () => {
    // Очищення даних (для E2E це бажано, але складніше. Можна пропустити для ЛР №5)
    await app.close();
  });
});
