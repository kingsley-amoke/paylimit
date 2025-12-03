User Service – Clean Architecture (Node.js + TypeScript + Prisma + Postgres)

This project implements a modular, scalable, and plug-and-play User Service following Clean Architecture, Domain-Driven Design, and Repository Pattern.
It provides a well-structured foundation for authentication, user management, roles, KYC status, and address management.

🚀 Features

Clean and simplified feature-first folder structure

Strongly typed domain entities

DTO mappers for request/response transformations

Repository interfaces for persistence abstraction

Prisma ORM with PostgreSQL

Single-address per user enforcement

Easy plug-and-play architecture for new modules

📁 Folder Structure
src/
features/
user/
domain/
entities/
dto/
value-objects/
mappers/
repository/
application/
use-cases/
infrastructure/
prisma/
controllers/
routes/
core/
errors/
utils/
config/
main.ts

This structure ensures each feature is fully isolated and easy to maintain or replace.

🛠️ Tech Stack

Node.js (TypeScript)

Prisma ORM

PostgreSQL

Express / Fastify (your choice)

Zod or class-validator for validation

Docker (optional)

📦 Installation
git clone <repo-url>
cd project
npm install

⚙️ Environment Setup

Create a .env file:

DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
PORT=3000

📚 Database Setup
npx prisma migrate dev
npx prisma generate

▶️ Run the Application
npm run dev

🧱 Architecture Overview
Domain Layer

Core business rules

Entities, Value Objects, DTOs, Mappers

No external dependencies

Application Layer

Use cases (business actions)

Works only with repository interfaces

Infrastructure Layer

Prisma models & repository implementations

Controllers and routes

This ensures maximum flexibility and maintainability.

🧪 Testing
npm run test

📄 License

MIT License – feel free to use and extend this project.
