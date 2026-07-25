import {
  Box,
  Paper,
  Grid,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
  Avatar,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeIcon from "@mui/icons-material/DarkModeOutlined";

import Layout from "../../components/layout/Layout";
import PageHeader from "../../components/common/PageHeader";
import { useThemeMode } from "../../context/ThemeModeContext";
import { useAuth } from "../../context/AuthContext";

export default function Settings() {
  const { mode, toggleMode } = useThemeMode();
  const { user } = useAuth();

  return (
    <Layout>
      <PageHeader title="Settings" subtitle="Preferences and account settings" />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Appearance
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: "action.hover", color: "text.primary" }}>
                  {mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
                </Avatar>
                <Box>
                  <Typography fontWeight={600}>Dark Mode</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Switch between light and dark theme
                  </Typography>
                </Box>
              </Stack>
              <FormControlLabel
                control={<Switch checked={mode === "dark"} onChange={toggleMode} />}
                label=""
                sx={{ m: 0 }}
              />
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Account
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Email</Typography>
                <Typography fontWeight={600}>{user?.email}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Role</Typography>
                <Typography fontWeight={600}>{user?.role}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Email verified</Typography>
                <Typography fontWeight={600}>{user?.is_email_verified ? "Yes" : "No"}</Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={12}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Security
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography color="text.secondary">
              To change your password, visit your{" "}
              <Box component="a" href="/profile" sx={{ color: "primary.main", fontWeight: 600 }}>
                Profile
              </Box>{" "}
              page.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
