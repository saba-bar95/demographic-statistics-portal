export default function PopulationCircles({ data, language, year, regionName }) {
  if (!data) return null;

  const { total, male, female } = data;

  const malePercent = total ? ((male / total) * 100).toFixed(1) : 0;
  const femalePercent = total ? ((female / total) * 100).toFixed(1) : 0;

  const items = [
    {
      label: language === "ka" ? "სულ" : "Total",
      percent: 100,
      display: total?.toLocaleString() ?? "—",
      color: "#9ca3af",
    },
    {
      label: language === "ka" ? "მამაკაცი" : "Male",
      percent: parseFloat(malePercent),
      display: `${malePercent}%`,
      color: "#3daadf",
    },
    {
      label: language === "ka" ? "ქალი" : "Female",
      percent: parseFloat(femalePercent),
      display: `${femalePercent}%`,
      color: "#f03f46",
    },
  ];

  const viewBox = 130;
  const stroke = 10;
  const radius = (viewBox - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden p-3 sm:gap-6 sm:p-4">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs sm:text-sm" style={{ color: "#ee1a26" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0080be"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
            <path d="M8 14h.01" />
            <path d="M12 14h.01" />
            <path d="M16 14h.01" />
            <path d="M8 18h.01" />
            <path d="M12 18h.01" />
            <path d="M16 18h.01" />
          </svg>
          {year}
        </span>
        <span className="flex gap-1.5 text-xs text-[#0080be] sm:text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="#0080be"
            className="h-4 w-4 shrink-0 opacity-60"
          >
            <path
              fillRule="evenodd"
              d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
              clipRule="evenodd"
            />
          </svg>
          {regionName}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-around gap-2">
        {items.map((item) => {
          const filled = (item.percent / 100) * circumference;
          const gap = circumference - filled;

          return (
            <div key={item.label} className="flex min-w-0 flex-col items-center gap-1 sm:gap-2">
              <div className="relative aspect-square w-full max-w-20 md:max-w-24 lg:max-w-28 xl:max-w-30 2xl:max-w-32">
                <svg viewBox={`0 0 ${viewBox} ${viewBox}`} className="h-full w-full -rotate-90">
                  <circle
                    cx={viewBox / 2}
                    cy={viewBox / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={stroke}
                    className="text-(--text) opacity-10"
                  />
                  <circle
                    cx={viewBox / 2}
                    cy={viewBox / 2}
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth={stroke}
                    strokeDasharray={`${filled} ${gap}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-(--text) md:text-sm">
                  {item.display}
                </span>
              </div>
              <span
                className="truncate text-sm font-medium text-(--text) md:text-base"
                style={{ fontFamily: "BPGMrgvlovani" }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
