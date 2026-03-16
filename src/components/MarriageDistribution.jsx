import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import useTheme from "../hooks/useTheme";

const SKIP = "არ არის მითითებული";
const displayGroup = (g) => (g === "16-19" ? "<20" : g);

const IMG_BASE = "https://database.geostat.ge/pyramid/img/";
// Map first age group of each cluster to its image number
const CLUSTER_IMG = { "16-19": "01", "30-34": "02", "45-49": "03", "60+": "04" };

const clusterRangeLabel = (groups) => {
  const last = groups[groups.length - 1];
  if (last.includes("+")) return last;
  const start = groups[0].split("-")[0];
  const end = last.split("-")[1];
  return `${start}-${end}`;
};

export default function MarriageDistribution({ data, language }) {
  const containerRef = useRef(null);
  const maleDotsRef = useRef({});
  const femaleDotsRef = useRef({});
  const { theme } = useTheme();

  const [selected, setSelected] = useState(null); // { gender: 'male'|'female', group }
  const [tooltip, setTooltip] = useState(null);
  const [lines, setLines] = useState([]);
  const [hoveredLine, setHoveredLine] = useState(null); // index of hovered line

  // Build lookup + derive age groups from data
  const { lookup, ageGroups } = useMemo(() => {
    const result = {};
    const groupSet = new Set();
    if (data) {
      data.forEach((row) => {
        const mg = row.MaleAgeGroup;
        const fg = row.FemaleAgeGroup;
        if (mg === SKIP || fg === SKIP) return;
        groupSet.add(mg);
        groupSet.add(fg);
        if (!result[mg]) result[mg] = {};
        result[mg][fg] = (result[mg][fg] ?? 0) + (row.MarriageCount ?? 0);
      });
    }
    const sorted = [...groupSet].sort((a, b) => {
      const na = parseInt(a, 10) || 999;
      const nb = parseInt(b, 10) || 999;
      return na - nb;
    });
    return { lookup: result, ageGroups: sorted };
  }, [data]);
  const getCount = (mg, fg) => lookup[mg]?.[fg] ?? 0;

  const clusters = useMemo(() => {
    const result = [];
    let current = null;
    ageGroups.forEach((group) => {
      if (CLUSTER_IMG[group] !== undefined) {
        current = { imgKey: group, imgNum: CLUSTER_IMG[group], groups: [] };
        result.push(current);
      }
      if (current) current.groups.push(group);
    });
    return result;
  }, [ageGroups]);

  const calcLines = useCallback(
    (currentSelected, currentLookup) => {
      if (!currentSelected || !containerRef.current) return [];

      const containerRect = containerRef.current.getBoundingClientRect();
      const getPos = (el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - containerRect.left,
          y: r.top + r.height / 2 - containerRect.top,
        };
      };

      const result = [];
      if (currentSelected.gender === "male") {
        const from = getPos(maleDotsRef.current[currentSelected.group]);
        if (!from) return [];
        ageGroups.forEach((fg) => {
          const to = getPos(femaleDotsRef.current[fg]);
          if (!to) return;
          result.push({
            x1: from.x,
            y1: from.y,
            x2: to.x,
            y2: to.y,
            count: currentLookup[currentSelected.group]?.[fg] ?? 0,
            maleGroup: currentSelected.group,
            femaleGroup: fg,
          });
        });
      } else {
        const from = getPos(femaleDotsRef.current[currentSelected.group]);
        if (!from) return [];
        ageGroups.forEach((mg) => {
          const to = getPos(maleDotsRef.current[mg]);
          if (!to) return;
          result.push({
            x1: from.x,
            y1: from.y,
            x2: to.x,
            y2: to.y,
            count: currentLookup[mg]?.[currentSelected.group] ?? 0,
            maleGroup: mg,
            femaleGroup: currentSelected.group,
          });
        });
      }
      return result;
    },
    [ageGroups],
  );

  // Recompute on resize (async callback — setState here is fine)
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      setSelected((prev) => {
        setLines(calcLines(prev, lookup));
        return prev;
      });
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [data, lookup, calcLines]);

  const handleGroupClick = (gender, group) => {
    const newSelected =
      selected?.gender === gender && selected?.group === group ? null : { gender, group };
    setSelected(newSelected);
    setLines(calcLines(newSelected, lookup));
    setTooltip(null);
  };

  const handleDotEnter = (e, maleGroup, femaleGroup) => {
    if (!containerRef.current) return;
    const count = getCount(maleGroup, femaleGroup);
    const containerRect = containerRef.current.getBoundingClientRect();
    const r = e.currentTarget.getBoundingClientRect();
    setTooltip({
      x: r.left + r.width / 2 - containerRect.left,
      y: r.top - containerRect.top - 6,
      count,
      maleGroup,
      femaleGroup,
    });
  };

  const lineColor = theme === "dark" ? "#e5e7eb" : "#111827";

  // All lines same width and dark
  const getLineProps = () => ({
    strokeWidth: 2,
    opacity: 0.95,
  });

  // Total marriages for the selected group (for percentage calc)
  const selectedTotal = useMemo(() => {
    if (!selected) return 0;
    return lines.reduce((sum, l) => sum + l.count, 0);
  }, [selected, lines]);

  const handleLineEnter = (e, line, idx) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    setHoveredLine(idx);
    setTooltip({
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top - 10,
      count: line.count,
      maleGroup: line.maleGroup,
      femaleGroup: line.femaleGroup,
    });
  };

  if (!data) return null;

  return (
    <div
      className="mt-4 mb-4 rounded-lg bg-(--bg) p-4 pt-4 sm:mt-6 sm:p-4 md:p-6"
      style={{ boxShadow: "var(--shadow)" }}
    >
      {/* Visualization */}
      <div ref={containerRef} className="relative">
        {/* SVG lines — rendered first so dots sit on top and receive clicks */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          {lines.filter((l) => l.count > 0).map((line, i) => {
            const { strokeWidth, opacity } = getLineProps();
            return (
              <g key={i}>
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="transparent"
                  strokeWidth={16}
                  onMouseEnter={(e) => handleLineEnter(e, line, i)}
                  onMouseLeave={() => {
                    setHoveredLine(null);
                    setTooltip(null);
                  }}
                  style={{ pointerEvents: "all", cursor: "default" }}
                />
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke={hoveredLine === i ? "#ef4444" : lineColor}
                  strokeWidth={hoveredLine === i ? strokeWidth + 2 : strokeWidth}
                  opacity={hoveredLine === i ? 1 : opacity}
                  style={{
                    pointerEvents: "none",
                    transition: "stroke 0.15s, stroke-width 0.15s, opacity 0.15s",
                  }}
                />
              </g>
            );
          })}
        </svg>

        <div className="flex items-center justify-between">
          {/* Male groups — left */}
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
            {clusters.map((cluster) => (
              <div key={cluster.imgKey} className="flex items-center gap-2 sm:gap-3 md:gap-5">
                <div className="flex shrink-0 flex-col items-center gap-1">
                  <img
                    src={`${IMG_BASE}${cluster.imgNum}m.png`}
                    alt="Male icon"
                    className="min-h-16 w-4 min-w-20 self-stretch object-contain object-center sm:min-h-24 sm:w-5 sm:min-w-32 md:min-h-30 md:min-w-40"
                  />
                  <span className="whitespace-nowrap text-sm font-semibold sm:text-base md:text-lg" style={{ color: "#0080be" }}>
                    {clusterRangeLabel(cluster.groups)}
                  </span>
                </div>
                <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
                  {cluster.groups.map((group) => {
                    const isSelected = selected?.gender === "male" && selected?.group === group;
                    return (
                      <div
                        key={group}
                        className="flex items-center justify-between gap-3 select-none sm:gap-4"
                      >
                        <span
                          className={`cursor-pointer text-sm font-medium sm:text-base ${isSelected ? "font-bold text-blue-500" : "text-(--text)"}`}
                          onClick={() => handleGroupClick("male", group)}
                        >
                          {displayGroup(group)}
                        </span>
                        <span
                          ref={(el) => (maleDotsRef.current[group] = el)}
                          className={`h-2.5 w-2.5 shrink-0 cursor-pointer rounded-full transition-transform duration-150 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 ${isSelected ? "scale-150" : "hover:scale-125"}`}
                          style={{ background: isSelected ? "#3b82f6" : "#93c5fd" }}
                          onClick={() => handleGroupClick("male", group)}
                          onMouseEnter={
                            selected?.gender === "female"
                              ? (e) => handleDotEnter(e, group, selected.group)
                              : undefined
                          }
                          onMouseLeave={() => setTooltip(null)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Female groups — right */}
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
            {clusters.map((cluster) => (
              <div key={cluster.imgKey} className="flex items-center gap-2 sm:gap-3 md:gap-5">
                <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
                  {cluster.groups.map((group) => {
                    const isSelected = selected?.gender === "female" && selected?.group === group;
                    return (
                      <div key={group} className="flex items-center gap-3 select-none sm:gap-4">
                        <span
                          ref={(el) => (femaleDotsRef.current[group] = el)}
                          className={`h-2.5 w-2.5 shrink-0 cursor-pointer rounded-full transition-transform duration-150 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5 ${isSelected ? "scale-150" : "hover:scale-125"}`}
                          style={{ background: isSelected ? "#ec4899" : "#f9a8d4" }}
                          onClick={() => handleGroupClick("female", group)}
                          onMouseEnter={
                            selected?.gender === "male"
                              ? (e) => handleDotEnter(e, selected.group, group)
                              : undefined
                          }
                          onMouseLeave={() => setTooltip(null)}
                        />
                        <span
                          className={`cursor-pointer text-sm font-medium sm:text-base ${isSelected ? "font-bold text-pink-500" : "text-(--text)"}`}
                          onClick={() => handleGroupClick("female", group)}
                        >
                          {displayGroup(group)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex shrink-0 flex-col items-center gap-1">
                  <img
                    src={`${IMG_BASE}${cluster.imgNum}f.png`}
                    alt="Female icon"
                    className="min-h-16 w-4 min-w-20 self-stretch object-contain object-center sm:min-h-24 sm:w-5 sm:min-w-32 md:min-h-30 md:min-w-40"
                  />
                  <span className="whitespace-nowrap text-sm font-semibold sm:text-base md:text-lg" style={{ color: "#0080be" }}>
                    {clusterRangeLabel(cluster.groups)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="pointer-events-none absolute z-20 rounded bg-gray-900 px-3 py-1.5 text-sm text-white shadow-lg"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
              whiteSpace: "nowrap",
            }}
          >
            {(() => {
              const pct =
                selectedTotal > 0 ? ((tooltip.count / selectedTotal) * 100).toFixed(1) : "0.0";
              return selected?.gender === "male"
                ? language === "ka"
                  ? `${tooltip.count.toLocaleString()} მამაკაცი (${pct}%) დაქორწინდა ${displayGroup(tooltip.femaleGroup)} ასაკის ქალებზე`
                  : `${tooltip.count.toLocaleString()} males (${pct}%) got married to females aged (${displayGroup(tooltip.femaleGroup)})`
                : language === "ka"
                  ? `${tooltip.count.toLocaleString()} ქალი (${pct}%) დაქორწინდა ${displayGroup(tooltip.maleGroup)} ასაკის მამაკაცებზე`
                  : `${tooltip.count.toLocaleString()} females (${pct}%) got married to males aged (${displayGroup(tooltip.maleGroup)})`;
            })()}
          </div>
        )}
      </div>

      {/* Hint */}
      {!selected && (
        <p className="mt-2 text-center text-xs text-(--text) opacity-40">
          {language === "ka"
            ? "ასაკობრივ ჯგუფზე დაჭერით ნახეთ კავშირები"
            : "Click an age group to see connections"}
        </p>
      )}
    </div>
  );
}
