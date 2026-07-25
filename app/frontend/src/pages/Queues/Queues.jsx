import { useState, useEffect } from "react";
import { Box, Paper, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Layout from "../../components/layout/Layout";
import PageHeader from "../../components/common/PageHeader";
import { queuesApi } from "../../api/queuesApi";
export default function Queues() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ (async()=>{ try{ const {items}=await queuesApi.list(); setRows(items.map((q,i)=>({id:q.name||i,...q}))); }catch{} finally{ setLoading(false); } })(); },[]);
  const columns = [{field:"name", headerName:"Queue Name", flex:1, minWidth:200}, {field:"status", headerName:"Status", width:150, renderCell:()=><Chip label="active" color="success" size="small" />}];
  return (<Layout><PageHeader title="Queues" subtitle="BullMQ queue activity - 3 queues" /><Paper elevation={0} sx={{p:3, borderRadius:3, border:"1px solid", borderColor:"divider"}}><Box sx={{height:400}}><DataGrid rows={rows} columns={columns} loading={loading} /></Box></Paper></Layout>);
}
