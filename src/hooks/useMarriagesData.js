import { useEffect, useState } from "react";
import { fetchMarriageYears, fetchMarriageTotal, fetchMarriageDistribution } from "../api/marriagesApi";

export default function useMarriagesData(selectedYear) {
  const [years, setYears] = useState([]);
  const [total, setTotal] = useState(null);
  const [distribution, setDistribution] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadYears() {
      try {
        const data = await fetchMarriageYears({ signal: controller.signal });
        setYears(data);
      } catch (err) {
        if (err?.name === "AbortError") return;
        setError(err);
      }
    }

    loadYears();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    const controller = new AbortController();

    async function loadData() {
      setIsLoading(true);
      try {
        const [totalData, distData] = await Promise.all([
          fetchMarriageTotal(selectedYear, { signal: controller.signal }),
          fetchMarriageDistribution(selectedYear, { signal: controller.signal }),
        ]);
        setTotal(totalData.total);
        setDistribution(distData);
      } catch (err) {
        if (err?.name === "AbortError") return;
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
    return () => controller.abort();
  }, [selectedYear]);

  return { years, total, distribution, isLoading, error };
}
