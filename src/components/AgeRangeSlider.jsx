import { useRef, useCallback } from "react";

export default function AgeRangeSlider({ ageGroups, value, onChange, theme }) {
  const trackRef = useRef(null);

  const getPercent = (idx) => (idx / (ageGroups.length - 1)) * 100;

  const indexFromEvent = useCallback(
    (clientY) => {
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = 1 - (clientY - rect.top) / rect.height;
      const clamped = Math.max(0, Math.min(1, ratio));
      return Math.round(clamped * (ageGroups.length - 1));
    },
    [ageGroups.length],
  );

  const handlePointerDown = useCallback(
    (handle, e) => {
      e.preventDefault();
      e.target.setPointerCapture(e.pointerId);

      const onMove = (moveE) => {
        const idx = indexFromEvent(moveE.clientY);
        if (handle === "high") {
          const next = { ...value, high: Math.max(value.low + 1, idx) };
          onChange(next);
          console.log("Age range →", ageGroups[next.low], "to", ageGroups[next.high]);
        } else {
          const next = { ...value, low: Math.min(value.high - 1, idx) };
          onChange(next);
          console.log("Age range →", ageGroups[next.low], "to", ageGroups[next.high]);
        }
      };
      const onUp = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
      };
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [value, onChange, indexFromEvent, ageGroups],
  );

  const handleTrackClick = useCallback(
    (e) => {
      const idx = indexFromEvent(e.clientY);
      const distToLow = Math.abs(idx - value.low);
      const distToHigh = Math.abs(idx - value.high);
      if (distToLow <= distToHigh) {
        const next = { ...value, low: Math.min(value.high - 1, idx) };
        onChange(next);
        console.log("Age range →", ageGroups[next.low], "to", ageGroups[next.high]);
      } else {
        const next = { ...value, high: Math.max(value.low + 1, idx) };
        onChange(next);
        console.log("Age range →", ageGroups[next.low], "to", ageGroups[next.high]);
      }
    },
    [value, onChange, indexFromEvent, ageGroups],
  );

  const isDark = theme === "dark";
  const trackBg = isDark ? "#374151" : "#d1d5db";
  const thumbBg = isDark ? "#9ca3af" : "#6b7280";

  const lowPct = getPercent(value.low);
  const highPct = getPercent(value.high);

  return (
    <div className="flex h-full flex-col items-center py-2">
      {/* Top label (high handle) */}
      <span
        className="mb-1 whitespace-nowrap text-[10px] font-bold sm:text-xs md:text-sm"
        style={{ color: thumbBg }}
      >
        {ageGroups[value.high]}
      </span>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative mx-auto flex-1 cursor-pointer rounded-full"
        style={{ width: 6, background: trackBg }}
        onClick={handleTrackClick}
      >
        {/* Selected range highlight */}
        <div
          className="absolute w-full rounded-full"
          style={{
            background: thumbBg,
            bottom: `${lowPct}%`,
            top: `${100 - highPct}%`,
          }}
        />

        {/* High handle */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer touch-none"
          style={{ top: `${100 - highPct}%` }}
          onPointerDown={(e) => handlePointerDown("high", e)}
        >
          <div
            className="rounded-sm"
            style={{ width: 24, height: 12, background: thumbBg, borderRadius: 2 }}
          />
        </div>

        {/* Low handle */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer touch-none"
          style={{ top: `${100 - lowPct}%` }}
          onPointerDown={(e) => handlePointerDown("low", e)}
        >
          <div
            className="rounded-sm"
            style={{ width: 24, height: 12, background: thumbBg, borderRadius: 2 }}
          />
        </div>
      </div>

      {/* Bottom label (low handle) */}
      <span
        className="mt-1 whitespace-nowrap text-[10px] font-bold sm:text-xs md:text-sm"
        style={{ color: thumbBg }}
      >
        {ageGroups[value.low]}
      </span>
    </div>
  );
}
