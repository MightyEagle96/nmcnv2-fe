import { useState } from "react";
import { useAppUser } from "../context/AppUserContext";
import {
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import {
  Biotech,
  Book,
  Dashboard,
  Edit,
  Home,
  Logout,
  People,
  Person,
  Scoreboard,
  Storage,
  Tv,
} from "@mui/icons-material";
import { accountRoles } from "../pages/public/SignupPage";
import { httpService } from "../httpService";
import type { AxiosError } from "axios";
import { Link } from "react-router-dom";

function SideMenuComponents() {
  const { user } = useAppUser();
  const [loading, setLoading] = useState(false);

  const links = [
    { path: "/", name: "Dashboard", icon: Dashboard },
    { path: "/servers", name: "Servers", icon: Storage },
    { path: "/examination", name: "Examination", icon: Edit },
    { path: "/monitoringdashboard", name: "Monitoring Dashboard", icon: Tv },
    { path: "/candidate", name: "Candidate", icon: Person },
    { path: "/programmes", name: "Programmes", icon: Book },
    { path: "/authoring", name: "Authoring", icon: Edit },
    { path: "/users", name: "Users", icon: People },
  ];

  const caosceLinks = [
    { path: "/caosce", name: "Home", icon: Home },
    { path: "/caosce/programmes", name: "Programmes", icon: Book },
    { path: "/procedures", name: "Procedures", icon: Biotech },
    { path: "/caosce/examination", name: "Examination", icon: Edit },
    { path: "/activityscore", name: "Activity Scores", icon: Scoreboard },
    { path: "/monitoringdashboard", name: "Monitoring Dashboard", icon: Tv },
  ];

  const logoutAccount = async () => {
    setLoading(true);
    try {
      const { data } = await httpService.get("/account/logout");

      if (data) {
        window.location.href = "/";
      }
    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.data) {
        console.log(err.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const linkFontSize = 14;
  const iconFontSize = 22;
  return (
    <div>
      <div className="bg-dark text-white rounded text-center p-3">
        <Person color="error" sx={{ height: 30, width: 30, mb: 2 }} />
        <Typography fontWeight={300} textTransform={"capitalize"}>
          Hi, {user?.username}
        </Typography>
      </div>

      {user?.role === accountRoles.admin && (
        <>
          <List
            sx={{ width: "100%", maxWidth: 360 }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                CBT SECTION
              </ListSubheader>
            }
          >
            {links.map((c) => (
              <ListItemButton
                component={Link}
                to={c.path}
                sx={{ fontSize: 10 }}
              >
                <ListItemIcon>
                  <c.icon sx={{ fontSize: iconFontSize }} />
                </ListItemIcon>
                <ListItemText
                  primary={c.name}
                  primaryTypographyProps={{ fontSize: linkFontSize }}
                />
              </ListItemButton>
            ))}
          </List>
          <Divider />
        </>
      )}
      {(user?.role === accountRoles.caosceAdmin ||
        user?.role === accountRoles.admin) && (
        <>
          <List
            sx={{ width: "100%", maxWidth: 360 }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                CAOSCE SECTION
              </ListSubheader>
            }
          >
            {caosceLinks.map((c) => (
              <ListItemButton component={Link} to={c.path}>
                <ListItemIcon>
                  <c.icon sx={{ fontSize: iconFontSize }} />
                </ListItemIcon>
                <ListItemText
                  primary={c.name}
                  primaryTypographyProps={{ fontSize: linkFontSize }}
                />
              </ListItemButton>
            ))}
          </List>
          <Divider />
        </>
      )}
      <ListItemButton disabled={loading} onClick={logoutAccount}>
        <ListItemIcon>
          {loading ? (
            <CircularProgress color="error" size={20} />
          ) : (
            <Logout color="error" />
          )}
        </ListItemIcon>
        <ListItemText primary="Logout" sx={{ color: "red" }} />
      </ListItemButton>
    </div>
  );
}

export default SideMenuComponents;
