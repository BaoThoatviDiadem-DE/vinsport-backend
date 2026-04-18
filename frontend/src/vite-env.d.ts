/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCK: string;
  readonly VITE_API_URL: string; // Thêm các biến khác của em vào đây
  // Thêm bất kỳ biến nào bắt đầu bằng VITE_ mà em có trong file .env
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}