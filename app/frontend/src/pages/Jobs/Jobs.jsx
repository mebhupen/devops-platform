import { useState, useEffect } from "react";
import { Box, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Layout from "../../components/layout/Layout";
import PageHeader from "../../components/common/PageHeader";
import { jobsApi } from "../../api/jobsApi";
export default function Jobs() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ (async()=>{ try{ const {items}=await jobsApi.list(); setRows(items); }catch{} finally{ setLoading(false); } })(); },[]);
  const columns = [{field:"id", headerName:"Job ID", flex:1}, {field:"name", headerName:"Name", flex:1}, {field:"status", headerName:"Status", width:130}];
  return (<Layout><PageHeader title="Jobs" subtitle={`Background jobs - ${rows.length} jobs`} /><Paper elevation={0} sx={{p:3, borderRadius:3, border:"1px solid", borderColor:"divider"}}><Box sx={{height:500}}><DataGrid rows={rows} columns={columns} loading={loading} /></Box></Paper></Layout>);
}
