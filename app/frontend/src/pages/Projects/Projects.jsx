import { useState, useEffect, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Box,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip,
  Stack,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";

import Layout from "../../components/layout/Layout";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { projectsApi } from "../../api/projectsApi";

const STATUS_COLORS = { active: "success", inactive: "default", archived: "warning" };

const schema = z.object({
  name: z.string().min(3, "At least 3 characters").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  status: z.enum(["active", "archived", "inactive"]),
  repository_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

function StatusBadge({ status }) {
  return <Chip label={status} size="small" color={STATUS_COLORS[status] || "default"} sx={{ textTransform: "capitalize" }} />;
}

export default function Projects() {
  const { user } = useAuth();
  const canCreate = ["Admin", "DevOps Engineer", "Developer"].includes(user?.role);
  const canEdit = ["Admin", "DevOps Engineer"].includes(user?.role);
  const canDelete = user?.role === "Admin";

  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formError, setFormError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { name: "", description: "", status: "active", repository_url: "" } });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { items, pagination } = await projectsApi.list({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: search || undefined,
        status: statusFilter || undefined,
        sortBy: "created_at",
        sortOrder: "desc",
      });
      setRows(items);
      setRowCount(pagination?.total ?? items.length);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [paginationModel, search, statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openCreateDialog = () => {
    setEditingProject(null);
    setFormError("");
    reset({ name: "", description: "", status: "active", repository_url: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (project) => {
    setEditingProject(project);
    setFormError("");
    reset({
      name: project.name,
      description: project.description || "",
      status: project.status,
      repository_url: project.repository_url || "",
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values) => {
    setFormError("");
    const payload = {
      ...values,
      description: values.description || undefined,
      repository_url: values.repository_url || undefined,
    };
    try {
      if (editingProject) {
        await projectsApi.update(editingProject.id, payload);
      } else {
        await projectsApi.create(payload);
      }
      setDialogOpen(false);
      fetchProjects();
    } catch (err) {
      setFormError(err?.response?.data?.message || "Failed to save project");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await projectsApi.remove(deleteTarget.id);
      setDeleteTarget(null);
      fetchProjects();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete project");
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 180 },
    { field: "description", headerName: "Description", flex: 1.4, minWidth: 220 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => <StatusBadge status={params.value} />,
    },
    {
      field: "created_at",
      headerName: "Created",
      width: 140,
      valueFormatter: (value) => (value ? new Date(value).toLocaleDateString() : ""),
    },
    {
      field: "actions",
      headerName: "",
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          {canEdit && (
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => openEditDialog(params.row)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {canDelete && (
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => setDeleteTarget(params.row)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Layout>
      <PageHeader
        title="Projects"
        subtitle="Manage the projects your team ships and deploys"
        actions={
          canCreate && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
              New Project
            </Button>
          )
        }
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            placeholder="Search projects..."
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPaginationModel((p) => ({ ...p, page: 0 }));
            }}
            sx={{ minWidth: 260 }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }}
          />
          <TextField
            select
            label="Status"
            size="small"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPaginationModel((p) => ({ ...p, page: 0 }));
            }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All statuses</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </TextField>
        </Stack>

        <Box sx={{ height: 560, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowCount={rowCount}
            loading={loading}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": { bgcolor: "action.hover" },
            }}
          />
        </Box>
      </Paper>

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{editingProject ? "Edit Project" : "New Project"}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register("name")}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              minRows={2}
              error={!!errors.description}
              helperText={errors.description?.message}
              {...register("description")}
            />
            <TextField
              fullWidth
              label="Repository URL"
              margin="normal"
              error={!!errors.repository_url}
              helperText={errors.repository_url?.message}
              {...register("repository_url")}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField {...field} select fullWidth label="Status" margin="normal">
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </TextField>
              )}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={20} color="inherit" /> : editingProject ? "Save Changes" : "Create"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <DialogTitle fontWeight={700}>Delete project?</DialogTitle>
        <DialogContent>
          This will archive "{deleteTarget?.name}". This action can be reversed by an admin via restore.
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} disabled={deleting}>
            {deleting ? <CircularProgress size={20} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
