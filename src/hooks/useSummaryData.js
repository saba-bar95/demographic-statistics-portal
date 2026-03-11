import { useCallback, useEffect, useState } from "react";
import {
  fetchSummaryByYear,
  fetchRegionSummaryByYear,
} from "../api/chartDataApi";

export default function useSummaryData(year = 2025, regionCode = null) {
  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = useCallback(
    async (targetYear, targetRegion, { signal } = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const payload = targetRegion
          ? await fetchRegionSummaryByYear(targetYear, targetRegion, { signal })
          : await fetchSummaryByYear(targetYear, { signal });

        const item = Array.isArray(payload) ? payload[0] : payload;
        setSummaryData(item ?? null);
      } catch (err) {
        if (err?.name === "AbortError") return;
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    loadData(year, regionCode, { signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [year, regionCode, loadData]);

  return { summaryData, isLoading, error };
}
