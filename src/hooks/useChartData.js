import { useCallback, useEffect, useState } from "react";
import {
  fetchChartDataByYear,
  fetchRegionDataByYear,
} from "../api/chartDataApi";

export default function useChartData(year, regionCode = null) {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [resolvedKey, setResolvedKey] = useState("");

  const requestKey = year != null ? `${year}:${regionCode ?? ""}` : "";
  const loading = requestKey !== "" && requestKey !== resolvedKey;

  useEffect(() => {
    if (year == null) return;
    const controller = new AbortController();
    const key = `${year}:${regionCode ?? ""}`;

    const fetchFn = regionCode
      ? fetchRegionDataByYear(year, regionCode, { signal: controller.signal })
      : fetchChartDataByYear(year, { signal: controller.signal });

    fetchFn
      .then((payload) => {
        setChartData(payload);
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

  const refetch = useCallback(() => {
    if (year == null) return;
    setResolvedKey("");
  }, [year]);

  return {
    chartData,
    isLoading: loading,
    error,
    refetch,
  };
}
