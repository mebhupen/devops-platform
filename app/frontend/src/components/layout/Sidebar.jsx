import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Drawer, Toolbar, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, IconButton, Tooltip } from "@mui/material";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import FolderIcon from "@mui/icons-material/FolderOutlined";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunchOutlined";
import AccountTreeIcon from "@mui/icons-material/AccountTreeOutlined";
import WorkIcon from "@mui/icons-material/WorkOutlineOutlined";
import QueueIcon from "@mui/icons-material/QueueOutlined";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeartOutlined";
import NotificationsIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlineOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlineOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StorageIcon from "@mui/icons-material/StorageOutlined";
import TaskIcon from "@mui/icons-material/TaskOutlined";
import KubernetesIcon from "@mui/icons-material/MemoryOutlined";

export const menuItems = [
  { title: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { title: "Projects", icon: <FolderIcon />, path: "/projects" },
  { title: "Deployments", icon: <RocketLaunchIcon />, path: "/deployments" },
  { title: "Pipelines", icon: <AccountTreeIcon />, path: "/pipelines" },
  { title: "Jobs", icon: <WorkIcon />, path: "/jobs" },
  { title: "Queues", icon: <QueueIcon />, path: "/queues" },
  { title: "Monitoring", icon: <MonitorHeartIcon />, path: "/monitoring" },
  { title: "Notifications", icon: <NotificationsIcon />, path: "/notifications" },
  { title: "Users", icon: <PeopleIcon />, path: "/users" },
  { title: "Roles", icon: <AdminPanelSettingsIcon />, path: "/roles" },
  { title: "Docker", icon: <StorageIcon />, path: "/docker" },
  { title: "Kubernetes", icon: <KubernetesIcon />, path: "/kubernetes" },
  { title: "Tasks", icon: <TaskIcon />, path: "/tasks" },
  { title: "Settings", icon: <SettingsIcon />, path: "/settings" },
  { title: "Profile", icon: <PersonIcon />, path: "/profile" },
];

const SIDEBAR_BG = "#111827";
const SidebarContent = ({ collapsed, onToggleCollapsed, isMobile }) => {
  const location = useLocation();
  return (
    <Box sx={{ height: "100%", bgcolor: SIDEBAR_BG, color: "#fff", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ justifyContent: collapsed ? "center" : "space-between", px: collapsed ? 1 : 2.5 }}>
        {!collapsed && <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5, whiteSpace: "nowrap" }}>Enterprise</Typography>}
        {!isMobile && <IconButton size="small" onClick={onToggleCollapsed} sx={{ color: "#9CA3AF", "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.06)" } }}>{collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}</IconButton>}
      </Toolbar>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <List sx={{ mt: 1, flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {menuItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          const button = (
            <ListItemButton key={item.title} component={Link} to={item.path} sx={{ mx: 1, mb: 0.5, borderRadius: 2, justifyContent: collapsed ? "center" : "flex-start", color: active ? "#fff" : "#D1D5DB", bgcolor: active ? "#2563EB" : "transparent", transition: "background-color 0.2s ease, color 0.2s ease", "&:hover": { bgcolor: active ? "#2563EB" : "#1F2937" } }}>
              <ListItemIcon sx={{ color: active ? "#fff" : "#D1D5DB", minWidth: collapsed ? 0 : 42, justifyContent: "center" }}>{item.icon}</ListItemIcon>
              {!collapsed && <ListItemText primary={item.title} slotProps={{ primary: { fontWeight: active ? 600 : 500 } }} />}
            </ListItemButton>
          );
          return collapsed ? <Tooltip key={item.title} title={item.title} placement="right">{button}</Tooltip> : button;
        })}
      </List>
    </Box>
  );
};
const Sidebar = ({ drawerWidth, collapsedWidth, collapsed, onToggleCollapsed, mobileOpen, onClose }) => {
  return (
    <>
      <Drawer variant="temporary" open={mobileOpen} onClose={onClose} ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", lg: "none" }, "& .MuiDrawer-paper": { width: drawerWidth, border: "none" } }}><SidebarContent collapsed={false} isMobile /></Drawer>
      <Box component={motion.div} animate={{ width: collapsed ? collapsedWidth : drawerWidth }} transition={{ duration: 0.25, ease: "easeInOut" }} sx={{ display: { xs: "none", lg: "block" }, position: "fixed", top: 0, left: 0, height: "100vh", zIndex: (theme) => theme.zIndex.drawer, overflow: "hidden" }}><SidebarContent collapsed={collapsed} onToggleCollapsed={onToggleCollapsed} /></Box>
    </>
  );
};
export default Sidebar;
