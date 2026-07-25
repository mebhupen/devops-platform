import { useState, useEffect } from "react";
import { Box, Paper, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Layout from "../../components/layout/Layout";
import PageHeader from "../../components/common/PageHeader";
import { rolesApi } from "../../api/rolesApi";
export default function Roles() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(()=>{ (async()=>{ try{ const {items}=await rolesApi.list(); setRows(items.map((r,i)=>({id:r.id||r.name||i,...r}))); }catch{ setError("Failed"); } finally{ setLoading(false); } })(); },[]);
  const columns = [{field:"id", headerName:"ID", flex:1, minWidth:200}, {field:"name", headerName:"Role Name", flex:1, minWidth:200}];
  return (<Layout><PageHeader title="Roles" subtitle="Role & permission management - 4 roles" />{error && <Alert severity="error" sx={{mb:2}}>{error}</Alert>}<Paper elevation={0} sx={{p:3, borderRadius:3, border:"1px solid", borderColor:"divider"}}><Box sx={{height:400}}><DataGrid rows={rows} columns={columns} loading={loading} /></Box></Paper></Layout>);
}
