// import { useEffect, useState } from "react";
// import { darkTheme, lightTheme } from "../theme/theme";
// import { useLocalStorage } from "./useLocalStorage";

// export function useAppTheme() {
//   const [theme, setTheme] = useState(darkTheme);
//   const [storedThemeMode, setStoredThemeMode] = useLocalStorage<
//     "dark" | "light"
//   >("themeMode", "light");

//   const toggleTheme = () => {
//     const currentTheme = theme.palette.mode === "dark" ? lightTheme : darkTheme;
//     setTheme(currentTheme);
//     setStoredThemeMode(currentTheme.palette.mode);
//     window.location.reload()
//   };

//   useEffect(() => {
//     const currentTheme = storedThemeMode === "dark" ? darkTheme : lightTheme;
//     if (currentTheme) {
//       setTheme(currentTheme);
//     }
//   }, [storedThemeMode]);

//   return [theme, toggleTheme] as const;
// }
