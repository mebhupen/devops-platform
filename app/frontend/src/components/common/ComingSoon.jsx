import { Box, Paper, Typography } from "@mui/material";
import ConstructionIcon from "@mui/icons-material/ConstructionOutlined";
import Layout from "../layout/Layout";
import PageHeader from "./PageHeader";

function ComingSoon({ title, subtitle }) {
  return (
    <Layout>
      <PageHeader title={title} subtitle={subtitle} />
      <Paper
        elevation={0}
        sx={{
          p: 6,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          textAlign: "center",
        }}
      >
        <ConstructionIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Not wired up yet
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 480, mx: "auto" }}>
          The backend doesn't currently expose an API for this section, so this page isn't connected to real
          data. It's here as a placeholder so navigation stays complete - let me know if you'd like the
          corresponding backend endpoints built out.
        </Typography>
      </Paper>
    </Layout>
  );
}

export default ComingSoon;
