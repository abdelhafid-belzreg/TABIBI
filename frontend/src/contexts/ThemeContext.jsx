import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ dark: false, toggleDark: () => {} });

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.setAttribute("data-bs-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.setAttribute("data-bs-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const toggleDark = () => setDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}