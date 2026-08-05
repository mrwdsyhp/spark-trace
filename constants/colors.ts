export const COLORS = {
  primaryBlue: "#4A7FE0",
  navy: "#1D3557",
  white: "#FFFFFF",
  black: "#111111",
  textGray: "#8A8A8A",
  bgLight: "#E8EAED",
  aman: "#2A9D8F",
  waspada: "#E9C46A",
  kritis: "#E63946",
};

export type RiskStatus = "aman" | "waspada" | "kritis";

export const STATUS_LABEL: Record<RiskStatus, string> = {
  aman: "Aman",
  waspada: "Waspada",
  kritis: "Kritis",
};

export const STATUS_COLOR: Record<RiskStatus, string> = {
  aman: COLORS.aman,
  waspada: COLORS.waspada,
  kritis: COLORS.kritis,
};