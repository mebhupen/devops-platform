import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";

import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useAuth } from "../../context/AuthContext";

const schema = z.object({
  email: z.string().min(1, "Email is required").refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

function Login() {
  const { user, loading: authLoading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  if (!authLoading && user) {
    const redirectTo = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (values) => {
    setServerError("");
    try {
      await login(values.email, values.password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || "Invalid email or password";
      setServerError(message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        elevation={0}
        sx={{ width: "100%", maxWidth: 1100, borderRadius: 4, overflow: "hidden", border: "1px solid", borderColor: "divider" }}
      >
        <Grid container>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              background: "linear-gradient(135deg,#2563EB,#1E293B)",
              color: "#fff",
              p: 6,
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "center",
              minHeight: 480,
            }}
          >
            <Typography variant="h3" fontWeight={700}>
              Enterprise DevOps Platform
            </Typography>
            <Typography sx={{ mt: 3, opacity: 0.9 }}>
              Manage projects, deployments, pipelines and infrastructure monitoring from a single dashboard.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{ p: { xs: 4, sm: 6 } }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Welcome back
            </Typography>
            <Typography color="text.secondary" mb={4}>
              Sign in to continue to your dashboard.
            </Typography>

            {serverError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {serverError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email")}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                margin="normal"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" size="small">
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{ mt: 3, py: 1.3, fontWeight: 700 }}
              >
                {isSubmitting ? <CircularProgress size={22} color="inherit" /> : "Sign In"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Login;
