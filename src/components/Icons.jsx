const base = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
const I = (children, extra) => (props) => <svg {...base} {...extra} {...props}>{children}</svg>;

/** Hình sao 8 cánh riêng của EndoAgent (không phải logo của hãng nào). */
export const Spark = ({ size = 24, ...p }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden {...p}>
    <path d="M16 3v26M3 16h26M7 7l18 18M25 7L7 25" />
  </svg>
);
export const Plus = I(<path d="M12 5v14M5 12h14" />);
export const SidebarIcon = I(<><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M9 4v16" /></>);
export const Clip = I(<path d="M21 11.5l-8.6 8.6a5.5 5.5 0 01-7.8-7.8l9-9a3.7 3.7 0 015.2 5.2l-9 9a1.8 1.8 0 01-2.6-2.6l8.2-8.1" />);
export const ArrowUp = I(<path d="M12 19V5M5 12l7-7 7 7" />, { strokeWidth: 2.2 });
export const Dots = I(<><circle cx="5" cy="12" r="1.2" fill="currentColor" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /><circle cx="19" cy="12" r="1.2" fill="currentColor" /></>);
export const Pencil = I(<path d="M4 20h4L19 9a2.8 2.8 0 00-4-4L4 16v4z" />);
export const Trash = I(<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3" />);
export const Copy = I(<><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 012-2h9" /></>);
export const Check = I(<path d="M5 12.5l4.5 4.5L19 7.5" />);
export const Logout = I(<path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3M10 8l-4 4 4 4M6 12h10" />);
export const Close = I(<path d="M6 6l12 12M18 6L6 18" />);
