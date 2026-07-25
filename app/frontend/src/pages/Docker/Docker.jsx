import { Box, Paper, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Layout from "../../components/layout/Layout";
import PageHeader from "../../components/common/PageHeader";
const rows = [
  { id: "enterprise-backend", name: "enterprise-backend", status: "running", image: "devops-platform-backend:latest", ports: "5000" },
  { id: "enterprise-frontend", name: "enterprise-frontend", status: "running", image: "devops-platform-frontend:latest", ports: "80" },
  { id: "enterprise-db", name: "enterprise-db", status: "healthy", image: "postgres:15", ports: "5432" },
  { id: "enterprise-redis", name: "enterprise-redis", status: "running", image: "redis:7", ports: "6379" },
];
export default function Docker() {
  const columns = [
    { field: "name", headerName: "Container", flex: 1, minWidth: 180 },
    { field: "status", headerName: "Status", width: 120, renderCell: p => <Chip label={p.value} size="small" color={p.value==="running"||p.value==="healthy"?"success":"default"} /> },
    { field: "image", headerName: "Image", flex: 1, minWidth: 220 },
    { field: "ports", headerName: "Ports", width: 100 },
  ];
  return (
    <Layout>
      <PageHeader title="Docker" subtitle="4 containers" />
      <Paper elevation={0} sx={{p:3, borderRadius:3, border:"1px solid", borderColor:"divider"}}>
        <Box sx={{height:400}}><DataGrid rows={rows} columns={columns} /></Box>
      </Paper>
    </Layout>
  );
}
