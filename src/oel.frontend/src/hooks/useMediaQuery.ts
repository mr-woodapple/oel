import { useEffect, useState } from "react";

/**
 * Simple hook that allows me to switch between layout sizes without using ":hidden" property, 
 * because that would still render elements to the DOM.
 * 
 * @param query 
 * @returns 
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    handleChange();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      mediaQuery.onchange = handleChange;
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.onchange = null;
      }
    };
  }, [query]);

  return matches;
}
