import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Stack,
  Chip,
  Divider,
  Skeleton,
  Alert,
} from "@mui/material";

import FolderIcon from "@mui/icons-material/FolderOutlined";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunchOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNoneOutlined";
import StorageIcon from "@mui/icons-material/StorageOutlined";
import MemoryIcon from "@mui/icons-material/MemoryOutlined";
import DnsIcon from "@mui/icons-material/DnsOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import Layout from "../../components/layout/Layout";
import PageHeader from "../../components/common/PageHeader";
import { projectsApi } from "../../api/projectsApi";
import { deploymentsApi } from "../../api/deploymentsApi";
import { notificationsApi } from "../../api/notificationsApi";
import { healthApi } from "../../api/healthApi";

const IN_PROGRESS = ["queued", "cloning", "building", "testing", "deploying"];
const STATUS_COLORS = {
  queued: "#94A3B8",
  cloning: "#60A5FA",
  building: "#60A5FA",
  testing: "#F59E0B",
  deploying: "#F59E0B",
  success: "#10B981",
  failed: "#EF4444",
};

function KpiCard({ title, value, icon, color, subtitle }) {
  return (
    <Paper
      component={motion.div}
      whileHover={{ y: -4 }}
      elevation={0}
      sx={{ p: 3, borderRadius: 3, height: "100%" }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700} mt={0.5}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: color, width: 52, height: 52 }}>{icon}</Avatar>
      </Stack>
    </Paper>
  );
}

function HealthRow({ label, status, message }) {
  const ok = status === "ok" || status === "skipped";
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.25 }}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        {ok ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
        <Typography fontWeight={600}>{label}</Typography>
      </Stack>
      <Chip label={status} size="small" color={ok ? "success" : "error"} sx={{ textTransform: "capitalize" }} />
    </Stack>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projectsTotal, setProjectsTotal] = useState(0);
  const [deployments, setDeployments] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [health, setHealth] = useState(null);

  const fetchAll = useCallback(async () => {
    setError("");
    try {
      const [projectsRes, deploymentsRes, notificationsRes, healthRes] = await Promise.allSettled([
        projectsApi.list({ limit: 1 }),
        deploymentsApi.list({ limit: 50, sortBy: "created_at", sortOrder: "desc" }),
        notificationsApi.list({ limit: 50, sortBy: "created_at", sortOrder: "desc" }),
        healthApi.check(),
      ]);

      if (projectsRes.status === "fulfilled") setProjectsTotal(projectsRes.value.pagination?.total ?? 0);
      if (deploymentsRes.status === "fulfilled") setDeployments(deploymentsRes.value.items);
      if (notificationsRes.status === "fulfilled") {
        setUnreadNotifications(notificationsRes.value.items.filter((n) => !n.is_read));
      }
      if (healthRes.status === "fulfilled") setHealth(healthRes.value);

      if ([projectsRes, deploymentsRes, notificationsRes, healthRes].every((r) => r.status === "rejected")) {
        setError("Unable to reach the backend API. Check that it's running and CORS is configured for this origin.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const timer = setInterval(fetchAll, 15000);
    return () => clearInterval(timer);
  }, [fetchAll]);

  const activeDeployments = deployments.filter((d) => IN_PROGRESS.includes(d.status)).length;
  const failedDeployments = deployments.filter((d) => d.status === "failed").length;

  const statusBreakdown = Object.entries(
    deployments.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({ name: status, value: count }));

  const trendByDay = Object.entries(
    deployments.reduce((acc, d) => {
      const day = new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([day, count]) => ({ day, count }))
    .slice(-7);

  const timeline = [
    ...deployments.slice(0, 6).map((d) => ({
      id: `d-${d.id}`,
      icon: <RocketLaunchIcon fontSize="small" />,
      color: STATUS_COLORS[d.status] || "#94A3B8",
      text: `Deployment to ${d.environment} - ${d.status}`,
      time: d.created_at,
    })),
    ...unreadNotifications.slice(0, 6).map((n) => ({
      id: `n-${n.id}`,
      icon: <NotificationsNoneIcon fontSize="small" />,
      color: "#7C3AED",
      text: n.title,
      time: n.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 8);

  if (loading) {
    return (
      <Layout>
        <PageHeader title="Dashboard" subtitle="Overview of your infrastructure" />
        <Grid container spacing={3}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Skeleton variant="rounded" height={110} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader title="Dashboard" subtitle="Overview of your infrastructure" />

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard title="Total Projects" value={projectsTotal} icon={<FolderIcon />} color="#2563EB" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard title="Active Deployments" value={activeDeployments} icon={<RocketLaunchIcon />} color="#7C3AED" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard title="Failed Deployments" value={failedDeployments} icon={<ErrorOutlineIcon />} color="#EF4444" subtitle="Last 50 runs" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <KpiCard title="Unread Notifications" value={unreadNotifications.length} icon={<NotificationsNoneIcon />} color="#F59E0B" />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight={700} mb={1}>
              Deployments Trend
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Deployments started per day (last 7 active days)
            </Typography>
            <Box sx={{ height: 260 }}>
              {trendByDay.length === 0 ? (
                <Stack alignItems="center" justifyContent="center" height="100%" color="text.secondary">
                  No deployment activity yet
                </Stack>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendByDay}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="day" fontSize={12} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Deployment Status
            </Typography>
            <Box sx={{ height: 260 }}>
              {statusBreakdown.length === 0 ? (
                <Stack alignItems="center" justifyContent="center" height="100%" color="text.secondary">
                  No deployments yet
                </Stack>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                      {statusBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#94A3B8"} />
                      ))}
                    </Pie>
                    <Legend />
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              System Health
            </Typography>
            {health ? (
              <>
                <HealthRow label="API" status={health.checks?.api?.status || "unknown"} />
                <Divider />
                <HealthRow label="PostgreSQL" status={health.checks?.database?.status || "unknown"} />
                <Divider />
                <HealthRow label="Redis / Queues" status={health.checks?.redis?.status || "unknown"} />
                <Divider />
                <Stack direction="row" justifyContent="space-between" sx={{ pt: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Uptime
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {Math.floor((health.uptime || 0) / 60)}m
                  </Typography>
                </Stack>
              </>
            ) : (
              <Typography color="text.secondary">Health data unavailable</Typography>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Recent Activity
            </Typography>
            {timeline.length === 0 ? (
              <Typography color="text.secondary">No recent activity</Typography>
            ) : (
              <Stack spacing={2}>
                {timeline.map((item) => (
                  <Stack key={item.id} direction="row" spacing={2} alignItems="flex-start">
                    <Avatar sx={{ width: 32, height: 32, bgcolor: item.color }}>{item.icon}</Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {item.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(item.time).toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
