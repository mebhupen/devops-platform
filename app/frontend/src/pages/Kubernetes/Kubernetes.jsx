import { Box, Paper, Chip, Grid, Card, CardContent, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Layout from "../../components/layout/Layout";
import PageHeader from "../../components/common/PageHeader";
const pods = [
  { id: "backend-xyz", name: "backend-7d9f8", status: "Running", namespace: "default", restarts: 0 },
  { id: "frontend-abc", name: "frontend-5c2a1", status: "Running", namespace: "default", restarts: 1 },
  { id: "db-0", name: "postgres-0", status: "Running", namespace: "default", restarts: 0 },
  { id: "redis-0", name: "redis-0", status: "Running", namespace: "default", restarts: 0 },
];
export default function Kubernetes() {
  const columns = [
    { field: "name", headerName: "Pod", flex: 1, minWidth: 180 },
    { field: "namespace", headerName: "Namespace", width: 120 },
    { field: "status", headerName: "Status", width: 120, renderCell: () => <Chip label="Running" size="small" color="success" /> },
    { field: "restarts", headerName: "Restarts", width: 100 },
  ];
  return (
    <Layout>
      <PageHeader title="Kubernetes" subtitle="Local cluster - 4 pods" />
      <Grid container spacing={2} sx={{mb:3}}>
        {[{k:"Nodes",v:"1"},{k:"Pods",v:"4"},{k:"Deployments",v:"2"},{k:"Services",v:"3"}].map(s=>(
          <Grid key={s.k} size={{xs:12, sm:6, md:3}}><Card elevation={0} sx={{border:"1px solid", borderColor:"divider", borderRadius:3}}><CardContent><Typography variant="body2" color="text.secondary">{s.k}</Typography><Typography variant="h5" fontWeight={700}>{s.v}</Typography></CardContent></Card></Grid>
        ))}
      </Grid>
      <Paper elevation={0} sx={{p:3, borderRadius:3, border:"1px solid", borderColor:"divider"}}><Box sx={{height:400}}><DataGrid rows={pods} columns={columns} /></Box></Paper>
    </Layout>
  );
}
