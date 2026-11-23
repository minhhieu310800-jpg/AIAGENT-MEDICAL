import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Clip, Close } from "./Icons.jsx";

export default function Composer({ text, setText, file, pickFile, clearFile, onSend, busy, fileInputRef, placeholder }) {
  const taRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => url && URL.revokeObjectURL(url), [url]);

  // tự giãn chiều cao ô nhập
  useLayoutEffect(() => {
    const t = taRef.current;
    if (!t) return;
    t.style.height = "auto";
    t.style.height = Math.min(t.scrollHeight, 200) + "px";
  }, [text]);

  const canSend = !busy && (text.trim() || file);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (canSend) onSend();
    }
  };
  const onPaste = (e) => {
    const f = [...(e.clipboardData?.files || [])].find((x) => x.type.startsWith("image/"));
    if (f) {
      e.preventDefault();
      pickFile(f);
    }
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    pickFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className={"composer" + (drag ? " drag" : "")}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
    >
      {url && (
        <div className="attach">
          <img src={url} alt="Ảnh đính kèm" />
          <button className="attach-x" onClick={clearFile} aria-label="Bỏ ảnh"><Close width={12} height={12} /></button>
        </div>
      )}
      <textarea
        ref={taRef}
        rows={1}
        value={text}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
      />
      <div className="composer-bar">
        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => pickFile(e.target.files[0])} />
        <button className="icon-btn round" onClick={() => fileInputRef.current?.click()} title="Đính kèm ảnh nội soi" aria-label="Đính kèm ảnh">
          <Clip />
        </button>
        <button className="send" onClick={onSend} disabled={!canSend} aria-label="Gửi">
          <ArrowUp />
        </button>
      </div>
    </div>
  );
}
