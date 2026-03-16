import { useEffect, useState } from "react";
import { fetchAgeDetails } from "../api/chartDataApi";

export default function useAgeDetails(year, ageGroups) {
  const [data, setData] = useState(null);
  const [resolvedKey, setResolvedKey] = useState("");
  const ageKey = ageGroups ? ageGroups.join(",") : "";
  const requestKey = ageKey ? `${year}:${ageKey}` : "";
  const isLoading = requestKey !== "" && requestKey !== resolvedKey;

  useEffect(() => {
    if (!ageKey) return;
    const controller = new AbortController();
    const groups = ageKey.split(",");
    const key = `${year}:${ageKey}`;

    fetchAgeDetails(year, groups, { signal: controller.signal })
      .then((res) => {
        setData(res);
        setResolvedKey(key);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          setData(null);
          setResolvedKey(key);
        }
      });

    return () => controller.abort();
  }, [year, ageKey]);

  return { data, isLoading };
}
