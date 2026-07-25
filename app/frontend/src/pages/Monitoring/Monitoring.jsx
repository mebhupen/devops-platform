import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Stack,
  Chip,
  Divider,
  Button,
  Alert,
  Skeleton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import StorageIcon from "@mui/icons-material/StorageOutlined";
import DnsIcon from "@mui/icons-material/DnsOutlined";
import QueueIcon from "@mui/icons-material/QueueOutlined";

import Layout from "../../components/layout/Layout";
import PageHeader from "../../components/common/PageHeader";
import { healthApi } from "../../api/healthApi";
import { BASE_URL } from "../../api/client";

const PROMETHEUS_URL = import.meta.env.VITE_PROMETHEUS_URL || "http://localhost:9090";
const GRAFANA_URL = import.meta.env.VITE_GRAFANA_URL || "http://localhost:3001";
const METRICS_URL = `${BASE_URL.replace(/\/api\/v1\/?$/, "")}/metrics`;

function CheckCard({ icon, label, status, message }) {
  const ok = status === "ok" || status === "skipped";
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={1.5}>
        <Box sx={{ color: "text.secondary" }}>{icon}</Box>
        <Typography fontWeight={700} sx={{ flex: 1 }}>
          {label}
        </Typography>
        {ok ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
      </Stack>
      <Chip label={status || "unknown"} size="small" color={ok ? "success" : "error"} sx={{ textTransform: "capitalize", mb: 1 }} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Paper>
  );
}

export default function Monitoring() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHealth = useCallback(async () => {
    setError("");
    try {
      const data = await healthApi.check();
      setHealth(data);
    } catch (err) {
      setError("Unable to reach the health endpoint.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const timer = setInterval(fetchHealth, 15000);
    return () => clearInterval(timer);
  }, [fetchHealth]);

  return (
    <Layout>
      <PageHeader title="Monitoring" subtitle="Live health checks and observability links" />

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <CheckCard icon={<DnsIcon />} label="API" status={health?.checks?.api?.status} message={`Uptime: ${Math.floor((health?.uptime || 0) / 60)}m`} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <CheckCard icon={<StorageIcon />} label="PostgreSQL" status={health?.checks?.database?.status} message={health?.checks?.database?.message} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <CheckCard icon={<QueueIcon />} label="Redis / BullMQ" status={health?.checks?.redis?.status} message={health?.checks?.redis?.message} />
          </Grid>
        </Grid>
      )}

      <Paper elevation={0} sx={{ p: 4, borderRadius: 3, mt: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Observability Tools
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Detailed metrics (CPU, memory, request rate, error rate) are exposed in Prometheus text format, not as
          JSON, so they're best viewed directly in Prometheus/Grafana rather than reconstructed here.
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button variant="outlined" endIcon={<OpenInNewIcon />} component="a" href={METRICS_URL} target="_blank" rel="noopener">
            Raw /metrics endpoint
          </Button>
          <Button variant="outlined" endIcon={<OpenInNewIcon />} component="a" href={PROMETHEUS_URL} target="_blank" rel="noopener">
            Open Prometheus
          </Button>
          <Button variant="contained" endIcon={<OpenInNewIcon />} component="a" href={GRAFANA_URL} target="_blank" rel="noopener">
            Open Grafana Dashboard
          </Button>
        </Stack>
      </Paper>
    </Layout>
  );
}
