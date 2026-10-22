export interface ThemePreset {
  name: string;
  primary: string;
  soft: string;
  description: string;
}

export const themePresets: ThemePreset[] = [
  {
    name: "Iris",
    primary: "#7457E8",
    soft: "#EEE9FF",
    description: "Expressive purple for creative products",
  },
  {
    name: "Lagoon",
    primary: "#0F8B8D",
    soft: "#DDF6F3",
    description: "Calm teal for thoughtful interfaces",
  },
  {
    name: "Citrus",
    primary: "#D97706",
    soft: "#FFF0D8",
    description: "Warm amber with a confident feel",
  },
  {
    name: "Berry",
    primary: "#D94670",
    soft: "#FFE4EC",
    description: "Bright berry for a lively product",
  },
];
