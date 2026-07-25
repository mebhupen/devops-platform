import { useState, useEffect } from "react";
import { Box, Paper, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Layout from "../../components/layout/Layout";
import PageHeader from "../../components/common/PageHeader";
import { pipelinesApi } from "../../api/pipelinesApi";
export default function Pipelines() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ (async()=>{ try{ const {items}=await pipelinesApi.list(); setRows(items); }catch{} finally{ setLoading(false); } })(); },[]);
  const columns = [{field:"id", headerName:"ID", width:220}, {field:"name", headerName:"Pipeline", flex:1, minWidth:200}, {field:"status", headerName:"Status", width:130}, {field:"created_at", headerName:"Created", width:140, valueFormatter:v=>v?new Date(v).toLocaleDateString():""}];
  return (<Layout><PageHeader title="Pipelines" subtitle={`CI/CD - ${rows.length} pipelines`} actions={<Button variant="contained">New Pipeline</Button>} /><Paper elevation={0} sx={{p:3, borderRadius:3, border:"1px solid", borderColor:"divider"}}><Box sx={{height:500}}><DataGrid rows={rows} columns={columns} loading={loading} /></Box></Paper></Layout>);
}
