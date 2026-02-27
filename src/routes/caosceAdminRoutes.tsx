import NotFound from "../pages/NotFound";
import CaosceAdminPage from "../pages/private/caosce/CaosceAdminPage";

export const caosceAdminRoutes = [
  { path: "/", component: CaosceAdminPage },
  { path: "*", component: NotFound },
];
