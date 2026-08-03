import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "knoxit-theme-colour";
const CUSTOM_KEY = "knoxit-theme-custom-colour";

export type ThemeOption = {
  id: string;
  name: string;
  value: string;
};

export const themeOptions: ThemeOption[] = [
  { id: "sky", name: "Sky", value: "#38bdf8" },
  { id: "mint", name: "Mint", value: "#34d399" },
  { id: "volt", name: "Volt", value: "#a3e635" },
  { id: "coral", name: "Coral", value: "#fb7185" },
  { id: "gold", name: "Gold", value: "#fbbf24" },
  { id: "violet", name: "Violet", value: "#a78bfa" }
];

type ThemeContextValue = {
  customColour: string;
  selectedColour: string;
  selectedId: string;
  setCustomColour: (colour: string) => void;
  setSelectedId: (id: string) => void;
  themeOptions: ThemeOption[];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isHexColour(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function readableTextColour(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? "#050507" : "#ffffff";
}

function applyTheme(colour: string) {
  const safeColour = isHexColour(colour) ? colour : themeOptions[0].value;
  const { r, g, b } = hexToRgb(safeColour);
  const root = document.documentElement;

  root.style.setProperty("--theme-primary", safeColour);
  root.style.setProperty("--theme-primary-rgb", `${r}, ${g}, ${b}`);
  root.style.setProperty("--theme-primary-text", readableTextColour(safeColour));
  root.style.setProperty("--theme-primary-soft", `rgba(${r}, ${g}, ${b}, 0.14)`);
  root.style.setProperty("--theme-primary-subtle", `rgba(${r}, ${g}, ${b}, 0.07)`);
  root.style.setProperty("--theme-primary-border", `rgba(${r}, ${g}, ${b}, 0.34)`);
  root.style.setProperty("--theme-primary-ring", `rgba(${r}, ${g}, ${b}, 0.55)`);
  root.style.setProperty("--theme-glow", `rgba(${r}, ${g}, ${b}, 0.16)`);
}

function getInitialTheme() {
  const selectedId = localStorage.getItem(STORAGE_KEY) ?? "sky";
  const customColour = localStorage.getItem(CUSTOM_KEY) ?? "#38bdf8";
  return {
    selectedId: selectedId === "custom" || themeOptions.some((option) => option.id === selectedId) ? selectedId : "sky",
    customColour: isHexColour(customColour) ? customColour : "#38bdf8"
  };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const initialTheme = useMemo(() => getInitialTheme(), []);
  const [selectedId, setSelectedIdState] = useState(initialTheme.selectedId);
  const [customColour, setCustomColourState] = useState(initialTheme.customColour);

  const selectedColour = useMemo(() => {
    if (selectedId === "custom") return customColour;
    return themeOptions.find((option) => option.id === selectedId)?.value ?? themeOptions[0].value;
  }, [customColour, selectedId]);

  useEffect(() => {
    applyTheme(selectedColour);
    localStorage.setItem(STORAGE_KEY, selectedId);
    localStorage.setItem(CUSTOM_KEY, customColour);
  }, [customColour, selectedColour, selectedId]);

  const setSelectedId = (id: string) => {
    if (id === "custom" || themeOptions.some((option) => option.id === id)) {
      setSelectedIdState(id);
    }
  };

  const setCustomColour = (colour: string) => {
    if (!isHexColour(colour)) return;
    setCustomColourState(colour);
    setSelectedIdState("custom");
  };

  return (
    <ThemeContext.Provider value={{ customColour, selectedColour, selectedId, setCustomColour, setSelectedId, themeOptions }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
