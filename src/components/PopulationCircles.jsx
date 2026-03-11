export default function PopulationCircles({ data, language }) {
  if (!data) return null;

  const { total, male, female } = data;

  const items = [
    {
      label: language === "ka" ? "სულ" : "Total",
      value: total,
      color: "var(--primary)",
    },
    {
      label: language === "ka" ? "მამაკაცი" : "Male",
      value: male,
      color: "#3b82f6",
    },
    {
      label: language === "ka" ? "ქალი" : "Female",
      value: female,
      color: "#ec4899",
    },
  ];

  const formatNumber = (n) => n?.toLocaleString() ?? "—";

  return (
    <div className="flex flex-wrap items-center justify-around gap-4">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-2">
          <div
            className="flex items-center justify-center rounded-full border-4"
            style={{
              borderColor: item.color,
              width: "8rem",
              height: "8rem",
            }}
          >
            <span className="text-sm font-bold text-(--text) sm:text-base">
              {formatNumber(item.value)}
            </span>
          </div>
          <span className="text-xs font-medium text-(--text) sm:text-sm">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
