import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Button,
  Alert,
  Skeleton,
  Divider,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNoneOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import Layout from "../../components/layout/Layout";
import PageHeader from "../../components/common/PageHeader";
import { notificationsApi } from "../../api/notificationsApi";

const TYPE_COLORS = { info: "primary", success: "success", warning: "warning", error: "error" };

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { items: data } = await notificationsApi.list({ limit: 50, sortBy: "created_at", sortOrder: "desc" });
      setItems(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markRead = async (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try {
      await notificationsApi.markRead(id);
    } catch {
      fetchNotifications();
    }
  };

  const unreadCount = items.filter((n) => !n.is_read).length;

  return (
    <Layout>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}` : "You're all caught up"}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ p: 3 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height={64} sx={{ mb: 1 }} />
            ))}
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <NotificationsNoneIcon sx={{ fontSize: 44, color: "text.secondary", mb: 1.5 }} />
            <Typography fontWeight={700} gutterBottom>
              No notifications
            </Typography>
            <Typography color="text.secondary">You don't have any notifications yet.</Typography>
          </Box>
        ) : (
          items.map((n, idx) => (
            <Box key={n.id}>
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                sx={{
                  p: 2.5,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  bgcolor: n.is_read ? "transparent" : "action.hover",
                  transition: "background-color 0.2s ease",
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: n.is_read ? "transparent" : "primary.main",
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                    <Typography fontWeight={n.is_read ? 500 : 700}>{n.title}</Typography>
                    <Chip label={n.type} size="small" color={TYPE_COLORS[n.type] || "default"} sx={{ textTransform: "capitalize" }} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {n.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(n.created_at).toLocaleString()}
                  </Typography>
                </Box>
                {!n.is_read && (
                  <Button size="small" startIcon={<CheckCircleOutlineIcon fontSize="small" />} onClick={() => markRead(n.id)}>
                    Mark read
                  </Button>
                )}
              </Box>
              {idx < items.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </Paper>
    </Layout>
  );
}
