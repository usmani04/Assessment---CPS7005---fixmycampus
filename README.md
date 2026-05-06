# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## FixMyCampus Setup

This repository contains a React + Vite frontend and an Express backend with MongoDB.

### Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the backend server:
   ```bash
   npm run server
   ```
3. Start the frontend app:
   ```bash
   npm run dev
   ```

Or run both together:
```bash
npm run dev:all
```

On Windows, you can also double-click `start-dev.bat` from the project root to launch the backend and frontend in separate windows.

If `npm` is not available in your shell, you can run the backend and frontend directly:

- Backend:
  ```bash
  node server/server.js
  ```
- Frontend:
  ```bash
  node node_modules/vite/bin/vite.js
  ```

### Environment configuration

Copy `.env.example` to `.env` and fill in your MongoDB Atlas connection string and email settings.

### Demo users

- `admin@fixmycampus.com` / `admin123`
- `student@fixmycampus.com` / `student123`
- `staff@fixmycampus.com` / `staff123`

### Notes

- The backend exposes `/api/health` for a quick health check.
- The frontend calls the backend at `http://localhost:5000/api`.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
