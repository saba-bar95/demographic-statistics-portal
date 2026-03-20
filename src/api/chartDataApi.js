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

export async function fetchSummaryByYear(year, { signal } = {}) {
  const response = await fetch(
    `${API_BASE_URL}/api/years/by-year?year=${encodeURIComponent(year)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch summary data (${response.status})`);
  }

  return response.json();
}

export async function fetchAgeDetails(year, ageGroups, { signal } = {}) {
  const response = await fetch(
    `${API_BASE_URL}/api/years/age-details?year=${encodeURIComponent(year)}&age=${encodeURIComponent(ageGroups.join(","))}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch age details (${response.status})`);
  }

  return response.json();
}

export async function fetchRegionAgeDetails(year, regionCode, ageGroups, { signal } = {}) {
  const response = await fetch(
    `${API_BASE_URL}/api/regionyears/age-details?year=${encodeURIComponent(year)}&region_code=${encodeURIComponent(regionCode)}&age=${encodeURIComponent(ageGroups.join(","))}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch region age details (${response.status})`);
  }

  return response.json();
}

export async function fetchLifeExpectancy(age, year, gender, { signal } = {}) {
  let url = `${API_BASE_URL}/api/lifedata/expectancy?age=${encodeURIComponent(age)}&year=${encodeURIComponent(year)}`;
  if (gender) {
    url += `&gender=${encodeURIComponent(gender)}`;
  }
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch life expectancy (${response.status})`);
  }

  return response.json();
}

export async function fetchRegionSummaryByYear(
  year,
  regionCode,
  { signal } = {},
) {
  const response = await fetch(
    `${API_BASE_URL}/api/regionyears?year=${encodeURIComponent(year)}&region_code=${encodeURIComponent(regionCode)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch region summary data (${response.status})`);
  }

  return response.json();
}
