import { API_BASE_URL } from "./apiBaseUrl";

export async function fetchChartDataByYear(year, { signal } = {}) {
  const response = await fetch(
    `${API_BASE_URL}/api/yeardetails/by-year?year=${encodeURIComponent(year)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch chart data (${response.status})`);
  }

  return response.json();
}

export async function fetchRegionDataByYear(year, regionCode, { signal } = {}) {
  const response = await fetch(
    `${API_BASE_URL}/api/regiondetails?year=${encodeURIComponent(year)}&region_code=${encodeURIComponent(regionCode)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch region data (${response.status})`);
  }

  return response.json();
}

export async function fetchAvailableYears({ signal } = {}) {
  const response = await fetch(`${API_BASE_URL}/api/yeardetails/years`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch years (${response.status})`);
  }

  return response.json();
}
