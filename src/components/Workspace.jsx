import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../api.js";
import Sidebar from "./Sidebar.jsx";
import Composer from "./Composer.jsx";
import Message from "./Message.jsx";
import { SidebarIcon, Spark } from "./Icons.jsx";

const MAX_FILE = 15 * 1024 * 1024;
let counter = 0;
const lid = () => `l${++counter}`;

function greeting(name) {
  const h = new Date().getHours();
  const part = h < 11 ? "buổi sáng" : h < 13 ? "buổi trưa" : h < 18 ? "buổi chiều" : "buổi tối";
  const first = (name || "").trim().split(/\s+/).pop(); // tên gọi của người Việt nằm ở cuối
  return first ? `Chào ${part}, ${first}` : `Chào ${part}`;
}

const QUICK = ["Model này nhận biết được những lớp nào?", "Bạn có thể giúp gì cho tôi?"];

export default function Workspace({ user, onLogout }) {
  const [sessions, setSessions] = useState([]);
  const [activeId, setActiveId] = useState(null); // null = cuộc trò chuyện mới
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 820);
  const fileInputRef = useRef(null);
  const endRef = useRef(null);

  const title = sessions.find((s) => s.id === activeId)?.title || "Cuộc trò chuyện mới";
  const isEmpty = messages.length === 0;

  const refreshSessions = useCallback(async () => {
    const { sessions: list } = await api("/sessions");
    setSessions(list);
    return list;
  }, []);

  useEffect(() => {
    refreshSessions().catch(() => {});
  }, [refreshSessions]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const closeOnMobile = () => window.innerWidth <= 820 && setSidebarOpen(false);

  const pickFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return alert("Chỉ nhận file ảnh.");
    if (f.size > MAX_FILE) return alert("Ảnh quá lớn (tối đa 15 MB).");
    setFile(f);
  };

  const newChat = () => {
    if (busy) return;
    setActiveId(null);
    setMessages([]);
    setText("");
    setFile(null);
    closeOnMobile();
  };

  const openSession = async (id) => {
    if (busy) return;
    closeOnMobile();
    if (id === activeId) return;
    try {
      const data = await api(`/sessions/${id}`);
      setActiveId(id);
      setMessages(
        data.messages.map((m) => ({ key: `m${m.id}`, role: m.role, content: m.content, image: m.image, vision: m.vision }))
      );
      setText("");
      setFile(null);
    } catch (e) {
      alert(e.message);
    }
  };

  const renameSession = async (id, newTitle) => {
    try {
      await api(`/sessions/${id}`, { method: "PATCH", json: { title: newTitle } });
      await refreshSessions();
    } catch (e) {
      alert(e.message);
    }
  };

  const deleteSession = async (s) => {
    if (!window.confirm(`Xóa cuộc trò chuyện "${s.title}"? Không thể khôi phục.`)) return;
    try {
      await api(`/sessions/${s.id}`, { method: "DELETE" });
      if (s.id === activeId) {
        setActiveId(null);
        setMessages([]);
      }
      await refreshSessions();
    } catch (e) {
      alert(e.message);
    }
  };

  const send = async () => {
    if (busy) return;
    const msg = text.trim();
    const f = file;
    if (!msg && !f) return;
    setBusy(true);
    const pending = { key: lid(), role: "assistant", pending: true };
    setMessages((m) => [...m, { key: lid(), role: "user", content: msg, image: f ? URL.createObjectURL(f) : null }, pending]);
    setText("");
    setFile(null);
    const replace = (patch) => setMessages((m) => m.map((x) => (x.key === pending.key ? { key: pending.key, role: "assistant", ...patch } : x)));
    try {
      const fd = new FormData();
      fd.append("message", msg);
      if (activeId) fd.append("session_id", activeId);
      if (f) fd.append("file", f);
      const data = await api("/chat", { method: "POST", body: fd });
      replace({ content: data.reply, vision: f ? data.vision : null, warn: data.saved === false });
      setActiveId(data.session_id);
      await refreshSessions();
    } catch (e) {
      replace({ error: e.message });
    } finally {
      setBusy(false);
    }
  };

  const composer = (placeholder) => (
    <Composer
      text={text} setText={setText} file={file} pickFile={pickFile} clearFile={() => setFile(null)}
      onSend={send} busy={busy} fileInputRef={fileInputRef} placeholder={placeholder}
    />
  );

  return (
    <div className={"shell" + (sidebarOpen ? " with-side" : "")}>
      <Sidebar
        open={sidebarOpen} onClose={() => setSidebarOpen(false)} sessions={sessions} activeId={activeId} user={user}
        onNew={newChat} onOpen={openSession} onRename={renameSession} onDelete={deleteSession} onLogout={onLogout}
      />

      <main className="main">
        <header className="topbar">
          {!sidebarOpen && (
            <button className="icon-btn" onClick={() => setSidebarOpen(true)} title="Mở thanh bên" aria-label="Mở thanh bên"><SidebarIcon /></button>
          )}
          <div className="topbar-title">{isEmpty ? "" : title}</div>
        </header>

        {isEmpty ? (
          <div className="home">
            <h1 className="hello serif"><Spark size={34} className="accent" /> {greeting(user.name)}</h1>
            <div className="home-composer">
              {composer("Gửi ảnh nội soi hoặc đặt câu hỏi cho EndoAgent")}
              <div className="chips">
                <button className="chip" onClick={() => fileInputRef.current?.click()}>Phân tích ảnh nội soi</button>
                {QUICK.map((q) => (
                  <button key={q} className="chip" onClick={() => setText(q)}>{q}</button>
                ))}
              </div>
            </div>
            <p className="disclaimer">Thông tin chỉ để tham khảo học tập; xử trí cụ thể do bác sĩ quyết định.</p>
          </div>
        ) : (
          <>
            <div className="thread">
              <div className="thread-inner">
                {messages.map((m) => <Message key={m.key} m={m} />)}
                <div ref={endRef} />
              </div>
            </div>
            <div className="dock">
              {composer("Trả lời EndoAgent…")}
              <p className="disclaimer">Thông tin chỉ để tham khảo học tập; xử trí cụ thể do bác sĩ quyết định.</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
