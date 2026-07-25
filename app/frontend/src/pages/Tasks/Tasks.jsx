import { useState, useEffect } from "react";
import { Box, Paper, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Layout from "../../components/layout/Layout";
import PageHeader from "../../components/common/PageHeader";
import { jobsApi } from "../../api/jobsApi";
export default function Tasks() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ (async()=>{ try{ const {items}=await jobsApi.list(); setRows(items.map((j,i)=>({id:j.id||String(i), ...j}))); }catch{} finally{ setLoading(false);} })(); },[]);
  const columns = [
    { field: "name", headerName: "Task / Job", flex: 1, minWidth: 200 },
    { field: "status", headerName: "Status", width: 130, renderCell: p => <Chip label={p.value||"pending"} size="small" color={p.value==="completed"?"success":p.value==="failed"?"error":"default"} /> },
    { field: "id", headerName: "ID", flex: 1, minWidth: 200 },
  ];
  return (<Layout><PageHeader title="Tasks" subtitle={`${rows.length} background tasks`} /><Paper elevation={0} sx={{p:3, borderRadius:3, border:"1px solid", borderColor:"divider"}}><Box sx={{height:500}}><DataGrid rows={rows} columns={columns} loading={loading} /></Box></Paper></Layout>);
}
