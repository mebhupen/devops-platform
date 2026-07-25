import { useState, useEffect, useCallback } from "react";
import { Box, Paper, Chip, Alert, TextField, InputAdornment, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import Layout from "../../components/layout/Layout";
import PageHeader from "../../components/common/PageHeader";
import { usersApi } from "../../api/usersApi";
export default function Users() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const fetchData = useCallback(async () => {
    setLoading(true);
    try { const { items } = await usersApi.list({ search: search || undefined }); setRows(items); }
    catch (e) { setError(e?.response?.data?.message || "Failed to load users"); }
    finally { setLoading(false); }
  }, [search]);
  useEffect(() => { fetchData(); }, [fetchData]);
  const columns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 160 },
    { field: "email", headerName: "Email", flex: 1.4, minWidth: 220 },
    { field: "role", headerName: "Role", width: 150, renderCell: p => <Chip label={p.value} size="small" color={p.value==="Admin"?"primary":"default"} /> },
    { field: "is_email_verified", headerName: "Verified", width: 110, renderCell: p => <Chip label={p.value? "Yes":"No"} size="small" color={p.value?"success":"default"} /> },
    { field: "created_at", headerName: "Created", width: 140, valueFormatter: v => v? new Date(v).toLocaleDateString() : "" },
  ];
  return (
    <Layout>
      <PageHeader title="Users" subtitle={`${rows.length} user accounts`} />
      {error && <Alert severity="error" sx={{mb:2}} onClose={()=>setError("")}>{error}</Alert>}
      <Paper elevation={0} sx={{p:3, borderRadius:3, border:"1px solid", borderColor:"divider"}}>
        <Stack direction="row" spacing={2} sx={{mb:2}}>
          <TextField placeholder="Search users..." size="small" value={search} onChange={e=>setSearch(e.target.value)} sx={{minWidth:260}} slotProps={{input:{startAdornment:<InputAdornment position="start"><SearchIcon fontSize="small"/></InputAdornment>}}} />
        </Stack>
        <Box sx={{height:520, width:"100%"}}><DataGrid rows={rows} columns={columns} loading={loading} pageSizeOptions={[10,25]} disableRowSelectionOnClick /></Box>
      </Paper>
    </Layout>
  );
}
