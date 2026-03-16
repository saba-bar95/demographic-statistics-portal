import { useMemo } from "react";
import useAgeDetails from "../hooks/useAgeDetails";

export default function AgeGroupDetails({
  chartData,
  ageRange,
  year,
  language,
  showAgeSlider,
  onToggleSlider,
}) {
  // Extract all age group labels from chart data
  const allAgeGroups = useMemo(() => (chartData ? chartData.map((d) => d.age) : []), [chartData]);

  // Always use ageRange to filter — button only toggles slider visibility on chart
  const selectedAgeGroups = useMemo(() => {
    if (allAgeGroups.length === 0) return [];
    const low = ageRange.low;
    const high = Math.min(ageRange.high, allAgeGroups.length - 1);
    return allAgeGroups.slice(low, high + 1);
  }, [allAgeGroups, ageRange]);

  // Always fetch — even on mount (when slider is off, sends all age groups)
  const { data, isLoading } = useAgeDetails(year, selectedAgeGroups);

  console.log("Selected age groups for details:", selectedAgeGroups);

  // Sort: 65+ on top, then 15-64, then <15 at bottom
  const sorted = useMemo(() => {
    const results = data?.results || [];
    const order = { 6: 0, 1: 1, "<": 2 };
    return [...results].sort(
      (a, b) => (order[a.age_group.trim()[0]] ?? 9) - (order[b.age_group.trim()[0]] ?? 9),
    );
  }, [data]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-3 sm:p-4">
      <button
        onClick={onToggleSlider}
        className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
          showAgeSlider
            ? "bg-[#0080be] text-white"
            : "border border-[#0080be] text-[#0080be] hover:bg-[#0080be]/10"
        }`}
      >
        {language === "ka" ? "ასაკის ფილტრი" : "Age Filter"}
      </button>

      <div className="w-full">
        {isLoading ? (
          <p className="text-center text-xs opacity-60">Loading...</p>
        ) : sorted.length > 0 ? (
          <div className="flex flex-col gap-2">
            {sorted.map((item) => (
              <div
                key={item.age_group}
                className="flex items-center justify-between gap-2 rounded-md bg-(--bg) px-2 py-1.5"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
              >
                <span className="text-xs font-semibold text-[#0080be] sm:text-sm">
                  {item.age_group}
                </span>
                <div className="flex gap-2 text-[10px] sm:gap-3 sm:text-xs">
                  <span className="font-medium text-(--text)">{item.million}M</span>
                  <span className="font-medium text-(--text)">{item.percent}%</span>
                  <span
                    className="font-medium"
                    title={language === "ka" ? "სქესობრივი თანაფარდობა" : "Sex ratio (M/F)"}
                  >
                    ♂/♀ {item.sex_ratio}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
