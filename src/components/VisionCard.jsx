const STATUS = { confident: "Chắc chắn", uncertain: "Chưa chắc chắn", out_of_domain: "Ngoài miền dữ liệu" };

export default function VisionCard({ vision }) {
  return (
    <div className="vision">
      <div className="vision-head">
        <span>Kết quả phân tích ảnh</span>
        <span className={`pill ${vision.status}`}>{STATUS[vision.status] || vision.status}</span>
      </div>
      {vision.status !== "out_of_domain" &&
        vision.top3.map((t) => (
          <div className="bar-row" key={t.label}>
            <span className="bar-name">{t.vi_name}</span>
            <span className="bar-val">{Math.round(t.prob * 100)}%</span>
            <div className="bar"><i style={{ width: `${Math.round(t.prob * 100)}%` }} /></div>
          </div>
        ))}
    </div>
  );
}
