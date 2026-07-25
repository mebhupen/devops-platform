import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";

import {
  Box,
  Paper,
  Grid,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  LinearProgress,
  CircularProgress,
  Stack,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunchOutlined";

import Layout from "../../components/layout/Layout";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { deploymentsApi } from "../../api/deploymentsApi";
import { projectsApi } from "../../api/projectsApi";

const STATUS_META = {
  queued: { color: "default", progress: 8 },
  cloning: { color: "info", progress: 25 },
  building: { color: "info", progress: 45 },
  testing: { color: "warning", progress: 65 },
  deploying: { color: "warning", progress: 85 },
  success: { color: "success", progress: 100 },
  failed: { color: "error", progress: 100 },
};

const schema = z.object({
  project_id: z.string().min(1, "Select a project"),
  environment: z.string().min(2, "At least 2 characters").max(50),
});

function DeploymentCard({ deployment, projectName }) {
  const meta = STATUS_META[deployment.status] || STATUS_META.queued;
  return (
    <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
      <Paper
        component={motion.div}
        whileHover={{ y: -4 }}
        elevation={0}
        sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%" }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Box>
            <Typography fontWeight={700}>{projectName || deployment.project_id}</Typography>
            <Typography variant="body2" color="text.secondary">
              {deployment.environment}
            </Typography>
          </Box>
          <Chip label={deployment.status} size="small" color={meta.color} sx={{ textTransform: "capitalize" }} />
        </Stack>

        <LinearProgress
          variant="determinate"
          value={meta.progress}
          color={meta.color === "default" ? "primary" : meta.color}
          sx={{ height: 6, borderRadius: 3, mb: 1.5 }}
        />

        <Typography variant="caption" color="text.secondary">
          Started {new Date(deployment.created_at).toLocaleString()}
        </Typography>
      </Paper>
    </Grid>
  );
}

export default function Deployments() {
  const { user } = useAuth();
  const canCreate = ["Admin", "DevOps Engineer"].includes(user?.role);

  const [deployments, setDeployments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { project_id: "", environment: "" } });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [{ items: deploymentItems }, { items: projectItems }] = await Promise.all([
        deploymentsApi.list({ limit: 30, sortBy: "created_at", sortOrder: "desc" }),
        projectsApi.list({ limit: 100 }),
      ]);
      setDeployments(deploymentItems);
      setProjects(projectItems);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load deployments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    // Deployments progress asynchronously via a background worker - poll for
    // updates. A future improvement would be subscribing to the app's
    // Socket.IO deployment events instead of polling.
    const timer = setInterval(fetchAll, 8000);
    return () => clearInterval(timer);
  }, [fetchAll]);

  const projectNameFor = (id) => projects.find((p) => p.id === id)?.name;

  const openDialog = () => {
    setFormError("");
    reset({ project_id: "", environment: "" });
    setDialogOpen(true);
  };

  const onSubmit = async (values) => {
    setFormError("");
    try {
      await deploymentsApi.create(values);
      setDialogOpen(false);
      fetchAll();
    } catch (err) {
      setFormError(err?.response?.data?.message || "Failed to start deployment");
    }
  };

  return (
    <Layout>
      <PageHeader
        title="Deployments"
        subtitle="Track deployment pipelines across your projects"
        actions={
          canCreate && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={openDialog}>
              New Deployment
            </Button>
          )
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : deployments.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
          <RocketLaunchIcon sx={{ fontSize: 44, color: "text.secondary", mb: 1.5 }} />
          <Typography fontWeight={700} gutterBottom>
            No deployments yet
          </Typography>
          <Typography color="text.secondary">Start one from a project to see it here.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {deployments.map((d) => (
            <DeploymentCard key={d.id} deployment={d} projectName={projectNameFor(d.project_id)} />
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>New Deployment</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <Controller
              name="project_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Project"
                  margin="normal"
                  error={!!errors.project_id}
                  helperText={errors.project_id?.message}
                >
                  {projects.map((p) => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <TextField
              fullWidth
              label="Environment"
              placeholder="production, staging, ..."
              margin="normal"
              error={!!errors.environment}
              helperText={errors.environment?.message}
              {...register("environment")}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Deploy"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Layout>
  );
}
