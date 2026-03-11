export default function MedianAge({ data, language }) {
  if (!data) return null;

  const { median_total, median_male, median_female } = data;

  const items = [
    {
      label: language === "ka" ? "სულ" : "Total",
      value: median_total,
      color: "var(--primary)",
    },
    {
      label: language === "ka" ? "მამაკაცი" : "Male",
      value: median_male,
      color: "#3b82f6",
    },
    {
      label: language === "ka" ? "ქალი" : "Female",
      value: median_female,
      color: "#ec4899",
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-center text-sm font-semibold text-(--text) sm:text-base">
        {language === "ka" ? "მედიანური ასაკი" : "Median Age"}
      </h3>
      <div className="flex flex-wrap items-center justify-around gap-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2">
            <div
              className="flex items-center justify-center rounded-full border-4"
              style={{
                borderColor: item.color,
                width: "6rem",
                height: "6rem",
              }}
            >
              <span className="text-lg font-bold text-(--text) sm:text-xl">
                {item.value ?? "—"}
              </span>
            </div>
            <span className="text-xs font-medium text-(--text) sm:text-sm">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
