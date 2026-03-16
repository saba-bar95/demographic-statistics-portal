import { useParams } from "react-router-dom";
import useTheme from "../hooks/useTheme";

export default function MarriageYearSlider({
  years,
  selectedYear,
  onYearChange,
  total,
  isLoading,
}) {
  const { language } = useParams();
  const { theme } = useTheme();

  if (!years.length) return null;

  const currentIndex = years.indexOf(selectedYear);

  const handleSliderChange = (e) => {
    onYearChange(years[Number(e.target.value)]);
  };

  const formattedTotal = isLoading
    ? "..."
    : total != null
      ? total.toLocaleString()
      : "—";

  return (
    <div
      className="rounded-lg bg-(--bg) p-4 sm:p-6 md:p-8"
      style={{ boxShadow: "var(--shadow)" }}
    >
      <style>{`
        .marriage-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          background: ${theme === "dark" ? "#374151" : "#d1d5db"};
          border-radius: 4px;
          outline: none;
          transition: background 0.3s ease;
        }
        .marriage-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 24px;
          background: ${theme === "dark" ? "#9ca3af" : "#6b7280"};
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.3s ease;
        }
        .marriage-slider::-moz-range-thumb {
          width: 12px;
          height: 24px;
          background: ${theme === "dark" ? "#9ca3af" : "#6b7280"};
          border-radius: 2px;
          cursor: pointer;
          border: none;
          transition: background 0.3s ease;
        }
      `}</style>

      <input
        type="range"
        min={0}
        max={years.length - 1}
        value={currentIndex >= 0 ? currentIndex : 0}
        onChange={handleSliderChange}
        className="marriage-slider w-full"
      />

      <div className="relative mt-1 h-8 w-full sm:h-10">
        {years.map((y, i) => {
          const pos = years.length > 1 ? (i / (years.length - 1)) * 100 : 50;
          const showOnMobile = i % 5 === 0 || i === years.length - 1;
          const showOnSm = i % 3 === 0 || i === years.length - 1;
          return (
            <span
              key={y}
              className={`absolute text-[9px] sm:text-[10px] md:text-xs ${
                y === selectedYear
                  ? "font-bold text-(--primary)"
                  : "opacity-60"
              } ${showOnMobile ? "block" : "hidden"} ${showOnSm ? "sm:block" : "sm:hidden"} md:block`}
              style={{
                left: `${pos}%`,
                transform: "translateX(-50%)",
              }}
            >
              {y}
            </span>
          );
        })}
      </div>

      <p className="mt-4 text-center text-sm font-semibold text-(--text) sm:text-base md:text-lg">
        {language === "ka" ? (
          <>
            <span className="text-(--primary)">{selectedYear}</span>
            {" წელს დარეგისტრირდა "}
            <span className="text-(--primary)">{formattedTotal}</span>
            {" ქორწინება"}
          </>
        ) : (
          <>
            <span className="text-(--primary)">{formattedTotal}</span>
            {" registered marriages in "}
            <span className="text-(--primary)">{selectedYear}</span>
          </>
        )}
      </p>
    </div>
  );
}
