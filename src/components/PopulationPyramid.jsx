import { useEffect, useRef, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { LuLock, LuLockOpen } from "react-icons/lu";
import { FaBackwardStep, FaForwardStep, FaCirclePlay, FaCirclePause } from "react-icons/fa6";
import ChartExportMenu from "./ChartExportMenu";

export default function PopulationPyramid({
  data,
  language = "en",
  years = [],
  year,
  onYearChange,
  theme = "light",
  isLocked = false,
  lockedData = null,
  lockedYear = null,
  onToggleLock,
  regionName,
}) {
  const chartRef = useRef(null);
  const rootRef = useRef(null);
  const intervalRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const exportingRef = useRef(null);
  const seriesRef = useRef({
    male: null,
    female: null,
    lockedMale: null,
    lockedFemale: null,
    yAxis: null,
    xAxis: null,
    legend: null,
    chart: null,
  });

  // Get theme colors
  const getThemeColors = (isDark) => ({
    text: isDark ? am5.color(0xe6eef8) : am5.color(0x0f172a),
    grid: isDark ? am5.color(0x374151) : am5.color(0xe5e7eb),
    bg: isDark ? am5.color(0x0b1220) : am5.color(0xffffff),
  });

  // Initialize chart once
  useEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);
    rootRef.current = root;

    // Setup exporting (without menu to avoid extra dots)
    const exporting = am5exporting.Exporting.new(root, {});
    exportingRef.current = exporting;

    // Remove amCharts logo
    if (root._logo) {
      root._logo.dispose();
    }

    root.setThemes([am5themes_Animated.new(root)]);

    const isDark = theme === "dark";
    const colors = getThemeColors(isDark);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout,
      }),
    );

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "age",
        renderer: am5xy.AxisRendererY.new(root, {
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
          minGridDistance: 10,
        }),
      }),
    );
    yAxis.get("renderer").labels.template.setAll({
      fontSize: 12,
      oversizedBehavior: "wrap",
      fill: colors.text,
    });
    yAxis.get("renderer").grid.template.setAll({
      stroke: colors.grid,
      strokeOpacity: 0.5,
    });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 50,
        }),
        numberFormat: "#.#",
      }),
    );

    xAxis.get("renderer").labels.template.setAll({
      fill: colors.text,
      fontSize: 12,
    });
    xAxis.get("renderer").grid.template.setAll({
      stroke: colors.grid,
      strokeOpacity: 0.5,
    });

    xAxis.get("renderer").labels.template.adapters.add("text", (text) => {
      if (text) {
        const num = parseFloat(text);
        return Math.abs(num).toFixed(1) + "%";
      }
      return text;
    });

    const maleSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: language === "ka" ? "მამაკაცი" : "Male",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "male",
        categoryYField: "age",
        sequencedInterpolation: true,
        clustered: false,
        tooltip: am5.Tooltip.new(root, {}),
      }),
    );

    maleSeries.columns.template.setAll({
      height: am5.percent(80),
      strokeOpacity: 0,
      fillOpacity: 0.8,
    });
    maleSeries.columns.template.set("fill", am5.color(0x5bcefa));

    maleSeries.get("tooltip").label.setAll({
      fontSize: 14,
    });
    maleSeries.get("tooltip").label.adapters.add("text", (text, target) => {
      const dataItem = target.dataItem;
      if (dataItem) {
        const dataContext = dataItem.dataContext;
        const count = dataContext?.maleCount?.toLocaleString() || "0";
        const percent = dataContext?.malePercent?.toFixed(2) || "0";
        return language === "ka"
          ? `მამაკაცი: ${count} (${percent}%)`
          : `Male: ${count} (${percent}%)`;
      }
      return text;
    });

    const femaleSeries = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: language === "ka" ? "ქალი" : "Female",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "female",
        categoryYField: "age",
        sequencedInterpolation: true,
        clustered: false,
        tooltip: am5.Tooltip.new(root, {}),
      }),
    );

    femaleSeries.columns.template.setAll({
      height: am5.percent(80),
      strokeOpacity: 0,
      fillOpacity: 0.8,
    });
    femaleSeries.columns.template.set("fill", am5.color(0xf5a9b8));

    femaleSeries.get("tooltip").label.setAll({
      fontSize: 14,
    });
    femaleSeries.get("tooltip").label.adapters.add("text", (text, target) => {
      const dataItem = target.dataItem;
      if (dataItem) {
        const dataContext = dataItem.dataContext;
        const count = dataContext?.femaleCount?.toLocaleString() || "0";
        const percent = dataContext?.femalePercent?.toFixed(2) || "0";
        return language === "ka"
          ? `ქალი: ${count} (${percent}%)`
          : `Female: ${count} (${percent}%)`;
      }
      return text;
    });

    // Locked year overlay series (yellow line from top to bottom)
    const lockedMaleSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: language === "ka" ? "მამაკაცი (ჩაკეტილი)" : "Male (locked)",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "lockedMale",
        categoryYField: "age",
        stroke: am5.color(0xffff00),
      }),
    );
    lockedMaleSeries.strokes.template.setAll({
      stroke: am5.color(0xffff00),
      strokeWidth: 2,
      strokeOpacity: 1,
    });

    const lockedFemaleSeries = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: language === "ka" ? "ქალი (ჩაკეტილი)" : "Female (locked)",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "lockedFemale",
        categoryYField: "age",
        stroke: am5.color(0xffff00),
      }),
    );
    lockedFemaleSeries.strokes.template.setAll({
      stroke: am5.color(0xffff00),
      strokeWidth: 2,
      strokeOpacity: 1,
    });

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
      }),
    );
    legend.labels.template.setAll({
      fill: colors.text,
      fontSize: 14,
    });
    legend.valueLabels.template.setAll({
      fill: colors.text,
      fontSize: 14,
    });
    // Only show main series in legend, not locked overlay series
    legend.data.setAll([maleSeries, femaleSeries]);

    chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "none",
        xAxis: xAxis,
        yAxis: yAxis,
      }),
    );

    seriesRef.current = {
      male: maleSeries,
      female: femaleSeries,
      lockedMale: lockedMaleSeries,
      lockedFemale: lockedFemaleSeries,
      yAxis,
      xAxis,
      legend,
      chart,
    };

    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [language, theme]);

  // Update data without recreating chart
  useEffect(() => {
    if (!data || data.length === 0) return;
    if (!seriesRef.current.male || !seriesRef.current.female) return;

    // Calculate totals by gender for current data
    const totalMale = data.reduce((sum, item) => sum + item.male, 0);
    const totalFemale = data.reduce((sum, item) => sum + item.female, 0);

    // Calculate locked data percentages if locked
    let lockedTotalMale = 0;
    let lockedTotalFemale = 0;
    if (isLocked && lockedData) {
      lockedTotalMale = lockedData.reduce((sum, item) => sum + item.male, 0);
      lockedTotalFemale = lockedData.reduce((sum, item) => sum + item.female, 0);
    }

    // Convert to gender-specific percentages (guard against division by zero)
    const chartData = data.map((item, index) => {
      const lockedItem = isLocked && lockedData ? lockedData[index] : null;
      return {
        age: item.age,
        male: totalMale > 0 ? -((item.male / totalMale) * 100) : 0,
        female: totalFemale > 0 ? (item.female / totalFemale) * 100 : 0,
        maleCount: item.male,
        femaleCount: item.female,
        malePercent: totalMale > 0 ? (item.male / totalMale) * 100 : 0,
        femalePercent: totalFemale > 0 ? (item.female / totalFemale) * 100 : 0,
        // Locked overlay data (null if not locked)
        lockedMale:
          lockedItem && lockedTotalMale > 0 ? -((lockedItem.male / lockedTotalMale) * 100) : null,
        lockedFemale:
          lockedItem && lockedTotalFemale > 0
            ? (lockedItem.female / lockedTotalFemale) * 100
            : null,
      };
    });

    seriesRef.current.yAxis.data.setAll(chartData);
    seriesRef.current.male.data.setAll(chartData);
    seriesRef.current.female.data.setAll(chartData);
    seriesRef.current.lockedMale.data.setAll(isLocked ? chartData : []);
    seriesRef.current.lockedFemale.data.setAll(isLocked ? chartData : []);
  }, [data, isLocked, lockedData]);

  const currentIndex = years.indexOf(year);

  const handleSliderChange = (e) => {
    const index = Number(e.target.value);
    const selectedYear = years[index];
    if (selectedYear && onYearChange) {
      onYearChange(selectedYear);
    }
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleLock = () => {
    if (onToggleLock) {
      onToggleLock();
    }
  };

  // Auto-play effect
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        const idx = years.indexOf(year);
        if (idx < years.length - 1) {
          onYearChange(years[idx + 1]);
        } else {
          setIsPlaying(false);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, year, years, onYearChange]);

  return (
    <div
      className="relative flex h-full flex-col rounded-lg bg-(--bg) p-2 sm:p-4"
      style={{ boxShadow: "var(--shadow)" }}
    >
      {/* Export menu */}
      <ChartExportMenu data={data} year={year} language={language} exportingRef={exportingRef} />

      {/* Year display and lock button at the top */}
      {years.length > 0 && (
        <div className="mb-2 flex items-center justify-center gap-2">
          {regionName && (
            <span className="text-xs font-semibold text-(--primary) sm:text-sm md:text-base">
              {regionName} —
            </span>
          )}
          <span className="text-[10px] font-medium sm:text-xs md:text-sm">
            {language === "ka" ? "წელი:" : "Year:"}
          </span>
          <span className="text-sm font-bold sm:text-base md:text-lg">{year}</span>
          {isLocked && (
            <span className="text-[10px] text-(--primary) sm:text-xs">
              ({language === "ka" ? "შედარება:" : "compare:"} {lockedYear})
            </span>
          )}
          <button
            onClick={toggleLock}
            className={`flex h-6 w-6 cursor-pointer items-center justify-center rounded border transition-colors duration-150 sm:h-7 sm:w-7 md:h-8 md:w-8 ${
              isLocked
                ? "border-(--primary) bg-(--primary) text-(--bg)"
                : "border-(--text) hover:bg-(--primary) hover:text-(--bg)"
            }`}
            title={
              language === "ka"
                ? isLocked
                  ? "განბლოკვა"
                  : "წლის დაფიქსირება"
                : isLocked
                  ? "Unlock year"
                  : "Lock year"
            }
          >
            {isLocked ? (
              <LuLock className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            ) : (
              <LuLockOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
            )}
          </button>
        </div>
      )}

      <div ref={chartRef} className="h-100 w-full sm:h-125 md:h-150 lg:h-0 lg:min-h-0 lg:flex-1" />

      {years.length > 0 && (
        <div>
          <style>{`
            .year-slider {
              -webkit-appearance: none;
              appearance: none;
              width: 100%;
              height: 6px;
              background: ${theme === "dark" ? "#374151" : "#d1d5db"};
              border-radius: 4px;
              outline: none;
              transition: background 0.3s ease;
            }
            .year-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 12px;
              height: 24px;
              background: ${theme === "dark" ? "#9ca3af" : "#6b7280"};
              border-radius: 2px;
              cursor: pointer;
              transition: background 0.3s ease;
            }
            .year-slider::-moz-range-thumb {
              width: 12px;
              height: 24px;
              background: ${theme === "dark" ? "#9ca3af" : "#6b7280"};
              border-radius: 2px;
              cursor: pointer;
              border: none;
              transition: background 0.3s ease;
            }
          `}</style>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              <button
                onClick={() => currentIndex > 0 && onYearChange(years[currentIndex - 1])}
                disabled={currentIndex <= 0 || isPlaying}
                className="flex cursor-pointer items-center justify-center text-blue-500 transition-colors duration-150 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                title={language === "ka" ? "წინა წელი" : "Previous year"}
              >
                <FaBackwardStep className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              </button>

              <button
                onClick={togglePlay}
                className="flex cursor-pointer items-center justify-center text-blue-500 transition-colors duration-150 hover:text-blue-700"
                title={
                  language === "ka"
                    ? isPlaying
                      ? "პაუზა"
                      : "დაკვრა"
                    : isPlaying
                      ? "Pause"
                      : "Play"
                }
              >
                {isPlaying ? (
                  <FaCirclePause className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                ) : (
                  <FaCirclePlay className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                )}
              </button>

              <button
                onClick={() =>
                  currentIndex < years.length - 1 && onYearChange(years[currentIndex + 1])
                }
                disabled={currentIndex >= years.length - 1 || isPlaying}
                className="flex cursor-pointer items-center justify-center text-blue-500 transition-colors duration-150 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                title={language === "ka" ? "შემდეგი წელი" : "Next year"}
              >
                <FaForwardStep className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              </button>
            </div>

            <input
              type="range"
              min={0}
              max={years.length - 1}
              value={currentIndex >= 0 ? currentIndex : 0}
              onChange={handleSliderChange}
              className="year-slider w-full"
            />

            <div className="relative mt-1 h-8 w-full sm:h-10">
              {years.map((y, i) => {
                const fewYears = years.length <= 10;
                const isMobileShow = fewYears || i % 20 === 0 || i === years.length - 1;
                const isSmShow = fewYears || i % 10 === 0 || i === years.length - 1;
                const isMdShow = fewYears || i % 6 === 0 || i === years.length - 1;
                const pos = years.length > 1 ? (i / (years.length - 1)) * 100 : 50;
                return (
                  <span
                    key={y}
                    className={`absolute text-[9px] sm:text-[10px] md:text-xs ${
                      y === year ? "font-bold text-(--primary)" : "opacity-60"
                    } ${isMobileShow ? "block" : "hidden"} ${isSmShow ? "sm:block" : "sm:hidden"} ${isMdShow ? "md:block" : "md:hidden"}`}
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
          </div>
        </div>
      )}

      {/* Footnotes */}
      <div className="mt-2 text-[10px] leading-relaxed opacity-70 sm:text-xs">
        {year > 1993 && (
          <p>
            {language === "ka"
              ? "* მონაცემები არ მოიცავს საქართველოს ოკუპირებულ ტერიტორიებს"
              : "* Data do not cover occupied territories"}
          </p>
        )}

        <p>
          {language === "ka"
            ? "* მოსახლეობის აღწერების მონაცემებით"
            : "* According to the census data"}
        </p>
        <p>
          {language === "ka"
            ? "* მოსახლეობის რიცხოვნობა 1 იანვრის მდგომარეობით"
            : "* Number of population as of 1 January"}
        </p>
        <p>
          {language === "ka"
            ? "* აღწერის გადაანგარიშებული შედეგები"
            : "* Estimated results of the census"}
        </p>
      </div>
    </div>
  );
}
