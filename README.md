# 📝 FlowNote

**FlowNote** is a full-stack application designed to streamline note-taking and blogging. It features a robust backend built with TypeScript and Prisma, a fast and modern frontend built with React, TypeScript, and Vite, and a shared common module for reusable utilities and type-safe data handling.

---

## 📁 Project Structure

The project is organized into the following directories:

- **`Backend/`**: Contains the server-side code, API routes, and database schema.
- **`Frontend/`**: Contains the client-side code, including React components and application pages.
- **`Common/`**: Shared utilities, validation schemas, and configurations used by both the backend and frontend.

---

## 🔧 Backend

### Features
- Built with **TypeScript** and the **Hono** framework.
- **Prisma** for database management and type-safe ORM.
- **JWT-based authentication** for secure user sessions.
- **RESTful APIs** for user, note, and blog operations.
- Environment variable management for flexible configuration.

### Database
- Prisma manages the schema in `prisma/schema.prisma`.
- Migrations are tracked under `prisma/migrations/`.

---

## 🎨 Frontend

### Features
- Built with **React**, **TypeScript**, and **Vite** for blazing-fast dev experience.
- **Tailwind CSS** for modern, utility-first styling.
- **React Router** for client-side routing.
- **Axios** for seamless API requests.
- ESLint for linting with an extendable config defined in `eslint.config.js`.

### Vite Configuration
- Fast build and dev server setup.
- Configuration files include `vite.config.ts` and `tsconfig.app.json`.

---

## 🧩 Common Module

### Features
- **Zod** schemas for robust input validation and type inference.
- Shared TypeScript types for consistency across backend and frontend.
- Centralized configuration and reusable utilities.

