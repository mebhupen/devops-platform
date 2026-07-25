import { createTheme } from "@mui/material/styles";

// Shared brand palette values used by both light and dark modes, per the
// design spec. Sidebar stays the same dark navy in both modes (a common
// pattern in premium SaaS dashboards - GitHub, Vercel, Linear all keep a
// persistently dark sidebar/rail regardless of the content theme).
export const brand = {
  primary: "#2563EB",
  secondary: "#7C3AED",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  sidebar: "#111827",
  bgLight: "#F8FAFC",
  bgDark: "#0F172A",
  cardDark: "#1E293B",
};

const baseTypography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h4: { fontWeight: 700, letterSpacing: -0.5 },
  h5: { fontWeight: 700, letterSpacing: -0.3 },
  h6: { fontWeight: 600 },
  button: { textTransform: "none", fontWeight: 600 },
};

export function getTheme(mode = "light") {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: { main: brand.primary },
      secondary: { main: brand.secondary },
      success: { main: brand.success },
      warning: { main: brand.warning },
      error: { main: brand.error },
      background: {
        default: isDark ? brand.bgDark : brand.bgLight,
        paper: isDark ? brand.cardDark : "#FFFFFF",
      },
      divider: isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB",
    },
    typography: baseTypography,
    shape: { borderRadius: 14 },
    shadows: Object.assign([], undefined, {
      // keep default shadow scale; individual components use soft custom
      // shadows via sx below rather than overriding the whole scale
    }),
    transitions: {
      duration: { shortest: 150, shorter: 200, short: 250, standard: 300 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: "background-color 0.25s ease, color 0.25s ease",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB"}`,
            boxShadow: isDark
              ? "0 4px 20px rgba(0,0,0,0.35)"
              : "0 1px 3px rgba(15,23,42,0.06)",
            transition: "transform 0.25s ease, box-shadow 0.25s ease",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 10 },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 600 },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { border: "none" },
        },
      },
    },
  });
}

// Backward-compatible default export (light theme) so any existing
// `import theme from "./theme/theme"` keeps working unchanged.
const theme = getTheme("light");
export default theme;
