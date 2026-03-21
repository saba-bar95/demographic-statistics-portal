import { useEffect, useState } from "react";
import { fetchAgeDetails, fetchRegionAgeDetails } from "../api/chartDataApi";

export default function useAgeDetails(year, ageGroups, regionCode) {
  const [data, setData] = useState(null);
  const [resolvedKey, setResolvedKey] = useState("");
  const ageKey = ageGroups ? ageGroups.join(",") : "";
  const requestKey = ageKey ? `${year}:${regionCode || ""}:${ageKey}` : "";
  const isLoading = requestKey !== "" && requestKey !== resolvedKey;

  useEffect(() => {
    if (!ageKey) return;
    const controller = new AbortController();
    const groups = ageKey.split(",");
    const key = `${year}:${regionCode || ""}:${ageKey}`;

    const fetchFn = regionCode
      ? fetchRegionAgeDetails(year, regionCode, groups, { signal: controller.signal })
      : fetchAgeDetails(year, groups, { signal: controller.signal });

    fetchFn
      .then((res) => {
        setData(res);
        setResolvedKey(key);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          setResolvedKey(key);
        }
      });

    return () => controller.abort();
  }, [year, ageKey, regionCode]);

  return { data, isLoading };
}
