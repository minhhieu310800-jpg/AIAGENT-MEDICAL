import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

let authInstance = null;

/** Khởi tạo Firebase Web trực tiếp từ biến môi trường VITE_FIREBASE_*. */
export function initAuth() {
  if (!authInstance) {
    const cfg = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    if (!cfg.apiKey) {
      throw new Error("Thiếu cấu hình Firebase (VITE_FIREBASE_API_KEY...).");
    }

    authInstance = getAuth(initializeApp(cfg));
  }
  return Promise.resolve(authInstance);
}
