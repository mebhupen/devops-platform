import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Toolbar } from "@mui/material";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const drawerWidth = 260;
const collapsedWidth = 80;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
  const handleDrawerClose = () => setMobileOpen(false);
  const handleCollapseToggle = () => setCollapsed((prev) => !prev);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", transition: "background-color 0.25s ease" }}>
      <Sidebar
        drawerWidth={drawerWidth}
        collapsedWidth={collapsedWidth}
        collapsed={collapsed}
        onToggleCollapsed={handleCollapseToggle}
        mobileOpen={mobileOpen}
        onClose={handleDrawerClose}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          ml: { lg: `${collapsed ? collapsedWidth : drawerWidth}px` },
          transition: "margin-left 0.25s ease-in-out",
          minWidth: 0,
        }}
      >
        <Navbar onMenuClick={handleDrawerToggle} />
        <Toolbar />

        <Box sx={{ flex: 1, px: { xs: 2, sm: 3, md: 4 }, py: 3, overflowX: "hidden" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
