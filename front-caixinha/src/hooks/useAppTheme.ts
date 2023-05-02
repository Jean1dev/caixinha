import { useEffect, useState } from "react";
import { darkTheme, lightTheme } from "../config/theme";
import { useLocalStorage } from "./useLocalStorage";

export function useAppTheme() {
  const [theme, setTheme] = useState(darkTheme);
  const [storedThemeMode, setStoredThemeMode] = useLocalStorage<
    "dark" | "light"
  >("themeMode", "dark");

  const toggleTheme = () => {
    const currentTheme = theme.palette.mode === "dark" ? lightTheme : darkTheme;
    setTheme(currentTheme);
    setStoredThemeMode(currentTheme.palette.mode);
  };

  useEffect(() => {
    const currentTheme = storedThemeMode === "dark" ? darkTheme : lightTheme;
    if (currentTheme) {
      setTheme(currentTheme);
    }
  }, [storedThemeMode]);

  return [theme, toggleTheme] as const;
}
