# COURSE MANAGEMENT API (Керування Курсами)

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>

</p>

## Project Summary (Виконані ЛР: 1, 3)

A RESTful back-end service developed using **Node.js** and **NestJS**. The API is designed to manage an online educational platform, focusing on courses, user roles, and enrollment tracking. The architecture is modular and built on a relational data model.

---

## Лабораторна Робота № 2: ER-Діаграма та Моделювання Даних

![ER-Diagrama](assets/err.png)
![Diahrama-Komponentiv](assets/comp.jpg)

### 1. Основні Сутності

| Сутність       | Опис                                                  | Ключові Поля                                                   |
| :------------- | :---------------------------------------------------- | :------------------------------------------------------------- |
| **User**       | Студенти та Викладачі (`role`).                       | `id` (PK), `email` (Unique), `firstName`, `lastName`, `role`   |
| **Course**     | Інформація про навчальний курс.                       | `id` (PK), `title`, `description`, `instructorId` (FK)         |
| **Enrollment** | Зв'язок "Багато-до-багатьох" між Студентом та Курсом. | `id` (PK), `studentId` (FK), `courseId` (FK), `enrollmentDate` |
| **Lesson**     | Окремі навчальні блоки, що належать курсу.            | `id` (PK), `title`, `content`, `courseId` (FK)                 |

### 2. Зв'язки

- **1 до N:** Викладач (`User`) → Курс (`Course`).
- **N до M:** Студент (`User`) ↔ Курс (`Course`) через таблицю `Enrollment`.
- **1 до N:** Курс (`Course`) → Урок (`Lesson`).

---

## Лабораторна Робота № 3: Імплементація Прототипу API (Статичні дані)

Реалізовано 8 RESTful маршрутів (Controller/Service)
| Модуль | Маршрут | HTTP Метод | Опис |
| :--- | :--- | :--- | :--- |
| **Users** | `/api/v1/users` | `GET` | Отримати список усіх користувачів |
| **Users** | `/api/v1/users` | `POST` | Створити нового користувача |
| **Users** | `/api/v1/users/:id` | `GET` | Отримати деталі користувача |
| **Users** | `/api/v1/users/:id` | `PUT` | Оновити профіль користувача |
| **Courses** | `/api/v1/courses` | `GET` | Отримати список усіх курсів |
| **Courses** | `/api/v1/courses` | `POST` | Створити новий курс |
| **Courses** | `/api/v1/courses/:id` | `GET` | Отримати деталі курсу |
| **Courses** | `/api/v1/courses/:id` | `DELETE` | Видалити курс |

---

## Technology Stack

- **Backend Runtime:** Node.js
- **Framework:** **NestJS** (TypeScript-based, modular).
- **Language:** **TypeScript**.
- **Database:** PostgreSQL (Планується інтеграція, ЛР №4).
- **ORM:** TypeORM (Планується інтеграція, ЛР №4).

## Development Setup and Tooling

Code quality and development flow are automated using the following tools, integrated via Git Hooks:

- **Code Formatter (Prettier):** Ensures consistent code style.
- **Static Analyzer (ESLint):** Enforces best practices.
- **Testing Framework (Jest):** Used for unit testing (ЛР №5) та перевірки контролерів.

## Project setup

```bash

$ npm install

```
