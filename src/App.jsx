import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { initAuth } from "./firebase.js";
import { api } from "./api.js";
import Login from "./components/Login.jsx";
import Workspace from "./components/Workspace.jsx";

export default function App() {
  const [phase, setPhase] = useState("loading"); // loading | out | in
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [fatal, setFatal] = useState(false); // không khởi tạo được Firebase → khóa nút đăng nhập

  useEffect(() => {
    let unsub = () => {};
    let cancelled = false;
    (async () => {
      try {
        const auth = await initAuth();
        if (cancelled) return;
        unsub = onAuthStateChanged(auth, async (u) => {
          if (!u) {
            setUser(null);
            setPhase("out");
            return;
          }
          try {
            const { user: p } = await api("/auth/login", { method: "POST" });
            setUser({
              name: p.display_name || u.displayName || "",
              email: p.email || u.email || "",
              photo: p.photo_url || u.photoURL || "",
            });
            setError("");
            setPhase("in");
          } catch (e) {
            setError(e.message);
            setPhase("out");
            signOut(auth);
          }
        });
      } catch (e) {
        setError(e.message);
        setFatal(true);
        setPhase("out");
      }
    })();
    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  if (phase === "loading") return <div className="boot"><div className="spinner" /></div>;
  if (phase === "out") return <Login error={error} disabled={fatal} />;
  return <Workspace user={user} onLogout={async () => signOut(await initAuth())} />;
}
