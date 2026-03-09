import { useEffect, useState } from "react";
import { fetchAvailableYears } from "../api/chartDataApi";

export default function useAvailableYears() {
  const [years, setYears] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadYears() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchAvailableYears({ signal: controller.signal });
        setYears(data);
      } catch (err) {
        if (err?.name === "AbortError") return;
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadYears();

    return () => {
      controller.abort();
    };
  }, []);

  return { years, isLoading, error };
}
