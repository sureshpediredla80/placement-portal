
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,

} from "@mui/material";
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import {
  Dashboard,
  People,
  School,
  Business,
  Assignment,
  CardMembership,
  MenuBook,
  EventNote,
  Newspaper,

  AccountTree,
  Psychology,
  AdminPanelSettings,
} from "@mui/icons-material";
import TopicIcon from "@mui/icons-material/Topic";
import { ROLES } from "../constants/roles";
import { ROUTES } from "../constants/routes";
import { useAuthContext } from "../hooks/useAuthContext";

const DRAWER_WIDTH = 220;

// ─── Menu Config per Role ─────────────────────────────────────────────────
const MENUS = {
  [ROLES.ADMIN]: [
    { label: "Dashboard", icon: <Dashboard />, path: ROUTES.ADMIN_DASHBOARD },
    { label: "Users", icon: <AdminPanelSettings />, path: ROUTES.ADMIN_USERS },
    { label: "Students", icon: <School />, path: ROUTES.ADMIN_STUDENTS },
    { label: "Coordinators", icon: <People />, path: ROUTES.ADMIN_COORDINATORS },
    { label: "Companies", icon: <Business />, path: ROUTES.ADMIN_COMPANIES },

    { label: "Applications", icon: <Assignment />, path: ROUTES.ADMIN_APPLICATIONS },
    { label: "Certificates", icon: <CardMembership />, path: ROUTES.ADMIN_CERTIFICATES },
    { label: "Topics", icon: <MenuBook />, path: ROUTES.ADMIN_TOPICS },
    { label: "Sessions", icon: <EventNote />, path: ROUTES.ADMIN_SESSIONS },
    { label:"NoticeBoard", icon: <Newspaper />, path: ROUTES.ADMIN_NEWS },
    { label: "Branches", icon: <AccountTree />, path: ROUTES.ADMIN_BRANCHES },
    { label: "Skills", icon: <Psychology />, path: ROUTES.ADMIN_SKILLS },

  ],
  [ROLES.COORDINATOR]: [
    { label: "Dashboard", icon: <Dashboard />, path: ROUTES.COORDINATOR_DASHBOARD },
    { label: "Students", icon: <School />, path: ROUTES.COORDINATOR_STUDENTS },
    { label: "Topics", icon: <TopicIcon/>, path: ROUTES.COORDINATOR_TOPICS},
    { label: "Companies", icon: <Business />, path: ROUTES.COORDINATOR_COMPANIES },
    { label: "Applications", icon: <Assignment />, path: ROUTES.COORDINATOR_APPLICATIONS },
    { label: "Certificates", icon: <CardMembership />, path: ROUTES.COORDINATOR_CERTIFICATES },
    { label: "Sessions", icon: <EventNote />, path: ROUTES.COORDINATOR_SESSIONS },
    { label: "NoticeBoard", icon: <Newspaper />, path: ROUTES.COORDINATOR_NEWS },

  ],
  [ROLES.STUDENT]: [
    { label: "Dashboard", icon: <Dashboard />, path: ROUTES.STUDENT_DASHBOARD },
    { label: "Companies", icon: <Business />, path: ROUTES.STUDENT_COMPANIES },
    { label: "Topics", icon: <TopicIcon/>, path: ROUTES.STUDENT_TOPICS},
    { label: "Applications", icon: <Assignment />, path: ROUTES.STUDENT_APPLICATIONS },
    { label: "Certificates", icon: <CardMembership />, path: ROUTES.STUDENT_CERTIFICATES },
    { label: "Sessions", icon: <EventNote />, path: ROUTES.STUDENT_SESSIONS },
    { label: "NoticeBoard", icon: <Newspaper />, path: ROUTES.STUDENT_NEWS },
    { label: "AI Resume Studio", icon:  <DescriptionOutlinedIcon /> ,path:ROUTES.STUDENT_RESUME},
  ],
};

// ─── Component ────────────────────────────────────────────────────────────
const Sidebar = ({ mobileOpen, onClose }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const role = user?.role;
  const menuItems = MENUS[role] || [];

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar>
        <Typography variant="h6" fontWeight={700} color="primary">
          🎓 Placement
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, pt: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={pathname === item.path || pathname.startsWith(item.path + "/")}
            onClick={() => {
              navigate(item.path);
              onClose?.();
            }}
            sx={{
              mx: 1,
              borderRadius: 2,
              mb: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "white",
                "& .MuiListItemIcon-root": { color: "white" },
                "&:hover": { bgcolor: "primary.dark" },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {role?.replace("ROLE_", "")} Portal
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
          variant="persistent"
          anchor="left"
          open={mobileOpen}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
            },
          }}
      >
        {drawerContent}
      </Drawer>



    </>
  );
};

export { DRAWER_WIDTH };
export default Sidebar;
