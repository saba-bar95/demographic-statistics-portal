import { API_BASE_URL } from "./apiBaseUrl";

export async function fetchMarriageYears({ signal } = {}) {
  const response = await fetch(`${API_BASE_URL}/api/marriages/years`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch marriage years (${response.status})`);
  }

  return response.json();
}

export async function fetchMarriageTotal(year, { signal } = {}) {
  const response = await fetch(
    `${API_BASE_URL}/api/marriages/total?year=${encodeURIComponent(year)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch marriage total (${response.status})`);
  }

  return response.json();
}

export async function fetchMarriageDistribution(year, { signal } = {}) {
  const response = await fetch(
    `${API_BASE_URL}/api/marriages?year=${encodeURIComponent(year)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch marriage distribution (${response.status})`);
  }

  return response.json();
}
