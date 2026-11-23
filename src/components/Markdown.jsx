import { useMemo } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Mọi link trong câu trả lời (đặc biệt mục "Nguồn") mở ở tab mới.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
});

export default function Markdown({ text }) {
  const html = useMemo(() => DOMPurify.sanitize(marked.parse(text || "", { gfm: true, breaks: true })), [text]);
  return <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
