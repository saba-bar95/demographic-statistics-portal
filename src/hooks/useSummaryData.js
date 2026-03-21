import { useEffect, useState } from "react";
import {
  fetchSummaryByYear,
  fetchRegionSummaryByYear,
} from "../api/chartDataApi";

export default function useSummaryData(year, regionCode = null) {
  const [summaryData, setSummaryData] = useState(null);
  const [error, setError] = useState(null);
  const [resolvedKey, setResolvedKey] = useState("");

  const requestKey = year != null ? `${year}:${regionCode ?? ""}` : "";
  const isLoading = requestKey !== "" && requestKey !== resolvedKey;

  useEffect(() => {
    if (year == null) return;
    const controller = new AbortController();
    const key = `${year}:${regionCode ?? ""}`;

    const fetchFn = regionCode
      ? fetchRegionSummaryByYear(year, regionCode, { signal: controller.signal })
      : fetchSummaryByYear(year, { signal: controller.signal });

    fetchFn
      .then((payload) => {
        const item = Array.isArray(payload) ? payload[0] : payload;
        setSummaryData(item ?? null);
        setError(null);
        setResolvedKey(key);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setError(err);
        setResolvedKey(key);
      });

    return () => {
      controller.abort();
    };
  }, [year, regionCode]);

  return { summaryData, isLoading, error };
}
