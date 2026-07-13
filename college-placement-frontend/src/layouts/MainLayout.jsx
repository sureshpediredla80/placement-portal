import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import Sidebar,{DRAWER_WIDTH} from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
        <Sidebar
            mobileOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
        />
        {sidebarOpen && (
            <Box
                onClick={() => setSidebarOpen(false)}
                sx={{
                    position: "fixed",
                    top: 0,
                    left: DRAWER_WIDTH,
                    right: 0,
                    bottom: 0,
                    zIndex: 1199,
                    backgroundColor: "transparent",
                }}
            />
        )}

      {/* Main content area */}
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                bgcolor: "background.default",
                minHeight: "100vh",

                ml: sidebarOpen ? `${DRAWER_WIDTH}px` : 0,

                transition: "margin-left 0.3s ease",
            }}
        >
        {/* Navbar */}
            <Navbar
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}/>

        {/* Page content below toolbar */}
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
