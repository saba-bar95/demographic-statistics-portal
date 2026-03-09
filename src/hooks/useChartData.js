import { useCallback, useEffect, useState } from "react";
import {
  fetchChartDataByYear,
  fetchRegionDataByYear,
} from "../api/chartDataApi";

export default function useChartData(year = 2025, regionCode = null) {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadChartData = useCallback(
    async (targetYear, targetRegion, { signal } = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const payload = targetRegion
          ? await fetchRegionDataByYear(targetYear, targetRegion, { signal })
          : await fetchChartDataByYear(targetYear, { signal });
        setChartData(payload);
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
    loadChartData(year, regionCode, { signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [year, regionCode, loadChartData]);

  const refetch = useCallback(
    () => loadChartData(year, regionCode),
    [year, regionCode, loadChartData],
  );

  return {
    chartData,
    isLoading,
    error,
    refetch,
  };
}
