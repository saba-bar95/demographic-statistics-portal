import { useMemo, useEffect } from "react";
import useAgeDetails from "../hooks/useAgeDetails";

// Parse an age group label like "< 15", "15-64", "65+" into a numeric range [min, max]
function parseAgeGroupRange(label) {
  const trimmed = label.trim();
  if (trimmed.startsWith("<")) {
    const num = parseInt(trimmed.replace(/[^0-9]/g, ""), 10);
    return [0, num - 1];
  }
  if (trimmed.endsWith("+")) {
    const num = parseInt(trimmed.replace(/[^0-9]/g, ""), 10);
    return [num, Infinity];
  }
  const parts = trimmed.split("-").map((s) => parseInt(s.trim(), 10));
  return [parts[0], parts[1]];
}

// Parse a chart age label like "0-4", "85+" into its start age
function parseChartAgeStart(label) {
  const trimmed = label.trim();
  return parseInt(trimmed.replace(/[^0-9].*/, ""), 10);
}

export default function AgeGroupDetails({
  chartData,
  ageRange,
  year,
  language,
  showAgeSlider,
  onToggleSlider,
  onBarColors,
  regionCode,
}) {
  const allAgeGroups = useMemo(() => (chartData ? chartData.map((d) => d.age) : []), [chartData]);

  const selectedAgeGroups = useMemo(() => {
    if (allAgeGroups.length === 0) return [];
    const low = ageRange.low;
    const high = Math.min(ageRange.high, allAgeGroups.length - 1);
    return allAgeGroups.slice(low, high + 1);
  }, [allAgeGroups, ageRange]);

  const { data, isLoading } = useAgeDetails(year, selectedAgeGroups, regionCode);

  // Sort: lowest age groups at bottom (< 15 last), 65+ on top
  const sorted = useMemo(() => {
    const results = data?.results || [];
    const order = { "<": 0, 1: 1, 6: 2 };
    return [...results].sort(
      (a, b) => (order[b.age_group.trim()[0]] ?? 9) - (order[a.age_group.trim()[0]] ?? 9),
    );
  }, [data]);

  // Rank by sex_ratio: highest gets darkest color
  const ratioColors = useMemo(() => {
    if (sorted.length === 0) return {};
    const colors = ["#004f75", "#0080be", "#b3dbee"];
    const ranked = [...sorted].sort((a, b) => Number(b.sex_ratio) - Number(a.sex_ratio));
    const colorMap = {};
    ranked.forEach((item, i) => {
      colorMap[item.age_group] = colors[Math.min(i, colors.length - 1)];
    });
    return colorMap;
  }, [sorted]);

  // Build a map from each chart age label to a color based on which age group it belongs to
  useEffect(() => {
    if (!onBarColors || sorted.length === 0 || !chartData) return;
    const allAges = chartData.map((d) => d.age);
    const colorMap = {};
    for (const item of sorted) {
      const [min, max] = parseAgeGroupRange(item.age_group);
      const color = ratioColors[item.age_group];
      for (const age of allAges) {
        const start = parseChartAgeStart(age);
        if (start >= min && start <= max) {
          colorMap[age] = color;
        }
      }
    }
    onBarColors(colorMap);
  }, [sorted, ratioColors, chartData, onBarColors]);

  return (
    <div className="flex w-full min-w-0 flex-col justify-between gap-4 overflow-hidden p-3 sm:p-4">
      {/* Top bar: group text + toggle switch */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#0080be] md:text-base">
          {language === "ka" ? "ჯგუფი" : "Group"}
        </span>

        {/* Toggle switch */}
        <button
          onClick={onToggleSlider}
          className={`relative h-4 w-8 shrink-0 rounded-full transition-colors duration-200 md:h-6 md:w-11 ${
            showAgeSlider ? "bg-[#0080be]" : "bg-gray-300"
          }`}
          aria-label={language === "ka" ? "ასაკის ფილტრი" : "Age Filter"}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform duration-200 md:h-5 md:w-5 ${
              showAgeSlider ? "translate-x-4 md:translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Column headers + Data rows */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div
          className={`grid min-w-0 gap-2 px-2 text-sm leading-tight font-medium tracking-wide text-(--text) capitalize opacity-60 md:text-sm ${"grid-cols-4"}`}
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)", fontFamily: "BPGMrgvlovani" }}
        >
          <span className="truncate">{language === "ka" ? "ასაკი" : "Age"}</span>
          <span className="truncate text-center">{language === "ka" ? "მლნ" : "Mln"}</span>
          <span className="truncate text-center">%</span>
          <span className="text-right">
            {language === "ka" ? "სქესთა თანაფარდობა" : "Sex Ratio"}
          </span>
        </div>

        {/* Data rows */}
        <div className="min-w-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="text-center text-xs opacity-60">
              {language === "ka" ? "იტვირთება..." : "Loading..."}
            </p>
          ) : sorted.length > 0 ? (
            <div className="flex flex-col gap-1 md:gap-2">
              {sorted.map((item) => (
                <div
                  key={item.age_group}
                  className={`grid min-w-0 items-center gap-1 rounded-md bg-(--bg) px-1 py-1 md:gap-2 md:px-2 md:py-1.5 ${"grid-cols-4"}`}
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                >
                  <span className="truncate text-xs md:text-sm">{item.age_group}</span>
                  <span className="truncate text-center text-xs font-medium text-(--text) md:text-sm">
                    {Number(item.million).toFixed(2)}
                  </span>
                  <span className="truncate text-center text-xs font-medium text-(--text) md:text-sm">
                    {Number(item.percent).toFixed(2)}
                  </span>
                  <span
                    className="flex items-center justify-end gap-2 text-right text-xs font-medium text-(--text) md:gap-3 md:text-sm"
                    title={language === "ka" ? "სქესობრივი თანაფარდობა" : "Sex ratio (M/F)"}
                  >
                    <span className="truncate">{Number(item.sex_ratio).toFixed(2)}</span>
                    {showAgeSlider && (
                      <span
                        className="h-3 w-7 shrink-0 rounded-sm md:h-4 md:w-9"
                        style={{ backgroundColor: ratioColors[item.age_group] }}
                      />
                    )}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
