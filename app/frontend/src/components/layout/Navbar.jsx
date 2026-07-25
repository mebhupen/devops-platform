import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  Avatar,
  InputBase,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from "@mui/material";

import {
  Menu as MenuIcon,
  NotificationsNone,
  Search,
  Brightness4,
  Brightness7,
  Settings,
  Logout,
  Person,
} from "@mui/icons-material";

import { useThemeMode } from "../../context/ThemeModeContext";
import { useAuth } from "../../context/AuthContext";
import { notificationsApi } from "../../api/notificationsApi";

const Navbar = ({ onMenuClick }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeMode();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = useCallback(async () => {
    try {
      const { items } = await notificationsApi.list({ limit: 50, sortBy: "created_at", sortOrder: "desc" });
      setUnreadCount(items.filter((n) => !n.is_read).length);
    } catch {
      // notifications are non-critical - fail silently in the navbar
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchUnread();
    const timer = setInterval(fetchUnread, 30000);
    return () => clearInterval(timer);
  }, [user, fetchUnread]);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLogout = async () => {
    handleCloseMenu();
    await logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: `1px solid ${theme.palette.divider}`,
        width: "100%",
        left: 0,
        transition: "background-color 0.25s ease, border-color 0.25s ease",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={onMenuClick} sx={{ display: { lg: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700, display: { xs: "none", sm: "block" } }}>
            Enterprise DevOps
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            bgcolor: mode === "dark" ? "rgba(255,255,255,0.06)" : "#F3F4F6",
            borderRadius: 3,
            px: 2,
            width: 350,
          }}
        >
          <Search sx={{ color: "text.secondary", mr: 1 }} fontSize="small" />
          <InputBase placeholder="Search projects, deployments..." fullWidth sx={{ fontSize: 14 }} />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            <IconButton onClick={toggleMode}>
              {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton onClick={() => navigate("/notifications")}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsNone />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title={user?.name || "Profile"}>
            <IconButton onClick={handleOpenMenu}>
              <Avatar sx={{ bgcolor: "primary.main", width: 38, height: 38, fontSize: 15 }}>{initials}</Avatar>
            </IconButton>
          </Tooltip>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
            <MenuItem onClick={() => { handleCloseMenu(); navigate("/profile"); }}>
              <Person sx={{ mr: 1 }} fontSize="small" /> Profile
            </MenuItem>
            <MenuItem onClick={() => { handleCloseMenu(); navigate("/settings"); }}>
              <Settings sx={{ mr: 1 }} fontSize="small" /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} fontSize="small" /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
