import { Link, Route, Routes } from "react-router-dom";
import { caosceAdminRoutes } from "./caosceAdminRoutes";
import { Breadcrumbs, Stack, Typography } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";

function CaosceRoutes() {
  return (
    <Routes>
      {caosceAdminRoutes.map((route, i) => (
        <Route path={route.path} element={<route.component />} key={i} />
      ))}
    </Routes>
  );
}

export default CaosceRoutes;

export function ApplicationNavigation({
  links,
  pageTitle,
}: {
  links: { path: string; name: string }[];
  pageTitle: string;
}) {
  //const user = useAppUser();
  return (
    <Stack spacing={2} className="mb-4">
      <Breadcrumbs separator={<NavigateNext />}>
        <Link
          style={{ color: "GrayText", textDecoration: "none" }}
          // component={Router}
          to="/caosce/programmes"
          //to={user?.user?.role === "candidate" ? "/" : "/admin"}
          color="inherit"
        >
          Programmes
        </Link>
        {links.map((link) => (
          <Link
            style={{ color: "GrayText", textDecoration: "none" }}
            //component={Router}
            to={link.path}
            color="inherit"
          >
            {link.name}
          </Link>
        ))}
        <Typography color="text.secondary" className="text-wrap">
          {pageTitle}
        </Typography>
      </Breadcrumbs>
    </Stack>
  );
}
