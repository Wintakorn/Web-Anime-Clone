import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      interval: 100, // เพิ่มช่วงเวลาในการตรวจสอบ (มิลลิวินาที)
      binaryInterval: 300, // สำหรับไฟล์ไบนารี
    },
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".ngrok-free.app", // รองรับทุก subdomain ของ ngrok
      ".netlify.app"
    ],
  },
})
