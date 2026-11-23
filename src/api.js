import { getAuth, signOut } from "firebase/auth";

/** Gọi REST API của FastAPI, tự gắn Firebase ID token. Ném Error(message tiếng Việt) khi lỗi. */
export async function api(path, { method = "GET", json, body } = {}) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Chưa đăng nhập.");
  const headers = { Authorization: `Bearer ${await user.getIdToken()}` };
  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  }
  let res;
  try {
    res = await fetch(path, { method, headers, body });
  } catch {
    throw new Error("Không kết nối được máy chủ. Kiểm tra lại mạng hoặc server.");
  }
  if (res.status === 401) {
    await signOut(auth);
    throw new Error("Phiên đăng nhập đã hết hạn.");
  }
  if (!res.ok) {
    let detail = `Lỗi ${res.status}`;
    try {
      const j = await res.json();
      if (j.detail) detail = typeof j.detail === "string" ? j.detail : JSON.stringify(j.detail);
    } catch {
      /* không phải JSON */
    }
    throw new Error(detail);
  }
  return res.json();
}
