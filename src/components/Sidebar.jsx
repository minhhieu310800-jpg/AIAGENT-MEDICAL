import { useEffect, useRef, useState } from "react";
import { Dots, Logout, Pencil, Plus, SidebarIcon, Spark, Trash } from "./Icons.jsx";

function fmt(iso) {
  const d = new Date(iso);
  return new Date().toDateString() === d.toDateString()
    ? d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
}

function Item({ s, active, onOpen, onRename, onDelete }) {
  const [menu, setMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(s.title);
  const ref = useRef(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e) => { if (!ref.current?.contains(e.target)) setMenu(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menu]);

  const commit = () => {
    setEditing(false);
    const t = val.trim();
    if (t && t !== s.title) onRename(s.id, t);
    else setVal(s.title);
  };

  if (editing) {
    return (
      <div className="chat-item editing">
        <input
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") { setVal(s.title); setEditing(false); }
          }}
        />
      </div>
    );
  }

  return (
    <div ref={ref} className={"chat-item" + (active ? " active" : "")} onClick={() => onOpen(s.id)} title={`${s.title} · ${fmt(s.updated_at)}`}>
      <span className="chat-title-text">{s.title}</span>
      <button className="icon-btn dots" aria-label="Tùy chọn" onClick={(e) => { e.stopPropagation(); setMenu((v) => !v); }}>
        <Dots />
      </button>
      {menu && (
        <div className="menu" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => { setMenu(false); setVal(s.title); setEditing(true); }}><Pencil /> Đổi tên</button>
          <button className="danger" onClick={() => { setMenu(false); onDelete(s); }}><Trash /> Xóa</button>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ open, onClose, sessions, activeId, user, onNew, onOpen, onRename, onDelete, onLogout }) {
  const [userMenu, setUserMenu] = useState(false);
  const footRef = useRef(null);
  useEffect(() => {
    if (!userMenu) return;
    const close = (e) => { if (!footRef.current?.contains(e.target)) setUserMenu(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [userMenu]);

  const initial = (user.name || user.email || "?").trim()[0]?.toUpperCase();

  return (
    <>
      <aside className={"sidebar" + (open ? " open" : "")}>
        <div className="side-top">
          <div className="wordmark serif"><Spark size={20} className="accent" /> EndoAgent</div>
          <button className="icon-btn" onClick={onClose} title="Đóng thanh bên" aria-label="Đóng thanh bên"><SidebarIcon /></button>
        </div>
        <button className="new-chat" onClick={onNew}><span className="plus"><Plus width={16} height={16} /></span> Cuộc trò chuyện mới</button>
        <div className="side-label">Gần đây</div>
        <nav className="chat-list">
          {sessions.length === 0 && <div className="empty-list">Chưa có cuộc trò chuyện nào.</div>}
          {sessions.map((s) => (
            <Item key={s.id} s={s} active={s.id === activeId} onOpen={onOpen} onRename={onRename} onDelete={onDelete} />
          ))}
        </nav>
        <div className="side-foot" ref={footRef}>
          {userMenu && (
            <div className="menu up">
              <div className="menu-email">{user.email}</div>
              <button onClick={onLogout}><Logout /> Đăng xuất</button>
            </div>
          )}
          <button className="user-btn" onClick={() => setUserMenu((v) => !v)}>
            {user.photo ? <img className="avatar" src={user.photo} alt="" referrerPolicy="no-referrer" /> : <span className="avatar ph">{initial}</span>}
            <span className="user-name">{user.name || user.email}</span>
          </button>
        </div>
      </aside>
      {open && <div className="scrim" onClick={onClose} />}
    </>
  );
}
