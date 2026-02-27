import { useEffect, useState } from "react";

const STORAGE_KEY = "text-size";

export default function useTextSize() {
  const [size, setSize] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
    } catch (e) {
      console.log(e);
    }
    return "normal";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (size === "large") {
      root.classList.add("large-text");
    } else {
      root.classList.remove("large-text");
    }
    try {
      localStorage.setItem(STORAGE_KEY, size);
    } catch (e) {
      console.log(e);
    }
  }, [size]);

  const toggle = () => setSize((s) => (s === "large" ? "normal" : "large"));

  return { size, setSize, toggle };
}
