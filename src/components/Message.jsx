import { useState } from "react";
import Markdown from "./Markdown.jsx";
import VisionCard from "./VisionCard.jsx";
import { Check, Copy, Spark } from "./Icons.jsx";

function Thinking() {
  return (
    <div className="thinking">
      <Spark size={20} className="spin accent" />
      <span>Đang xử lý…</span>
    </div>
  );
}

export default function Message({ m }) {
  const [copied, setCopied] = useState(false);

  if (m.role === "user") {
    return (
      <div className="msg-user">
        <div className="user-bubble">
          {m.image && <img className="shot" src={m.image} alt="Ảnh nội soi đã gửi" />}
          {m.content && <p>{m.content}</p>}
        </div>
      </div>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(m.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* trình duyệt không cho phép clipboard */
    }
  };

  return (
    <div className="msg-ai">
      {m.pending && <Thinking />}
      {m.error && <div className="error-box">{m.error}</div>}
      {!m.pending && !m.error && (
        <>
          {m.vision && <VisionCard vision={m.vision} />}
          <Markdown text={m.content} />
          {m.warn && <div className="warn-box">Câu trả lời này chưa được lưu vào lịch sử (lỗi cơ sở dữ liệu).</div>}
          <div className="msg-actions">
            <button className="icon-btn" onClick={copy} title="Sao chép" aria-label="Sao chép">
              {copied ? <Check /> : <Copy />}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
