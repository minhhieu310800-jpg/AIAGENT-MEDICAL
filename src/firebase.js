import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

let authPromise = null;

/** Lấy cấu hình Firebase Web từ server (/firebase-config) rồi khởi tạo một lần. */
export function initAuth() {
  if (!authPromise) {
    authPromise = fetch("/firebase-config")
      .then((r) => r.json())
      .then((cfg) => {
        if (!cfg.apiKey) throw new Error("Server chưa cấu hình Firebase (FIREBASE_API_KEY...).");
        return getAuth(initializeApp(cfg));
      })
      .catch((e) => {
        authPromise = null;
        throw e;
      });
  }
  return authPromise;
}
