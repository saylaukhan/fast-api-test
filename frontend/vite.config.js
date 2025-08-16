// frontend/vite.config.js - ФИНАЛЬНАЯ ВЕРСИЯ

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Импортируем модуль path

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    fs: {
      // Разрешаем доступ к файлам в директории на один уровень выше,
      // то есть в папке /project. Это самый надежный способ.
      allow: [
        path.resolve(__dirname, '..'),
      ],
    },
  }
});