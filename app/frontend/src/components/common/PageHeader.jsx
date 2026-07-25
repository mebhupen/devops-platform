import { Box, Typography } from "@mui/material";

function PageHeader({ title, subtitle, actions }) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ mt: 1, color: "text.secondary", fontSize: "1rem" }}>{subtitle}</Typography>
        )}
      </Box>

      {actions || (
        <Typography sx={{ color: "text.secondary", fontWeight: 500, whiteSpace: "nowrap" }}>{today}</Typography>
      )}
    </Box>
  );
}

export default PageHeader;
