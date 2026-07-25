import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Box,
  Paper,
  Grid,
  Typography,
  Avatar,
  Chip,
  TextField,
  Button,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";

import Layout from "../../components/layout/Layout";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/authApi";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: z.string().min(8, "At least 8 characters").max(128),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Profile() {
  const { user } = useAuth();
  const [successMsg, setSuccessMsg] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(passwordSchema), defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" } });

  const onSubmit = async (values) => {
    setSuccessMsg("");
    setServerError("");
    try {
      await authApi.changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      setSuccessMsg("Password changed successfully.");
      reset();
    } catch (err) {
      setServerError(err?.response?.data?.message || "Failed to change password");
    }
  };

  const initials = user?.name
    ? user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <Layout>
      <PageHeader title="Profile" subtitle="Your account information and security settings" />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider", textAlign: "center" }}>
            <Avatar sx={{ width: 84, height: 84, mx: "auto", mb: 2, bgcolor: "primary.main", fontSize: 30 }}>
              {initials}
            </Avatar>
            <Typography variant="h6" fontWeight={700}>
              {user?.name}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 1.5 }}>
              {user?.email}
            </Typography>
            <Chip label={user?.role} color="primary" size="small" />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Personal Information
            </Typography>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Name" value={user?.name || ""} disabled />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Email" value={user?.email || ""} disabled />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight={700} gutterBottom>
              Change Password
            </Typography>

            {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
            {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Current Password"
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword?.message}
                    {...register("currentPassword")}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="password"
                    label="New Password"
                    error={!!errors.newPassword}
                    helperText={errors.newPassword?.message}
                    {...register("newPassword")}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirm New Password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                  />
                </Grid>
              </Grid>

              <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Update Password"}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}
