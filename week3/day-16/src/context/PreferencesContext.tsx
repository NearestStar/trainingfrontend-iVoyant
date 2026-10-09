import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

type PreferencesContextType = {
  theme: Theme;
  toggleTheme: () => void;
  savedIds: number[];
  toggleSaved: (id: number) => void;
};

const PreferencesContext =
  createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    return localStorage.getItem("offbeat-theme") === "dark"
      ? "dark"
      : "light";
  });

  const [savedIds, setSavedIds] = useState<number[]>(() => {
    try {
      const value = localStorage.getItem("offbeat-saved");
      const parsed: unknown = value ? JSON.parse(value) : [];

      return Array.isArray(parsed) &&
        parsed.every(
          (id) => typeof id === "number" && Number.isFinite(id),
        )
        ? parsed
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("offbeat-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("offbeat-saved", JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleTheme = useCallback(() => {
    setTheme((current) =>
      current === "light" ? "dark" : "light",
    );
  }, []);

  const toggleSaved = useCallback((id: number) => {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id],
    );
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, savedIds, toggleSaved }),
    [theme, toggleTheme, savedIds, toggleSaved],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error(
      "usePreferences must be used inside PreferencesProvider",
    );
  }

  return context;
}