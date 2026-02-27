import { useEffect, useState } from "react";

const STORAGE_KEY = "theme-preference";

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
    } catch (e) {
      console.log(e);
    }
    // default to system preference
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.log(e);
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, setTheme, toggle };
}
