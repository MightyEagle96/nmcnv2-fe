import NotFound from "../pages/NotFound";
import Activities from "../pages/private/caosce/Activities";
import CaosceAdminPage from "../pages/private/caosce/CaosceAdminPage";
import CaosceProgrammes from "../pages/private/caosce/CaosceProgrammes";
import Items from "../pages/private/caosce/Items";
import ProgrammePage from "../pages/private/caosce/ProgrammePage";

export const caosceAdminRoutes = [
  { path: "/", component: CaosceAdminPage },
  { path: "/programmes", component: CaosceProgrammes },
  { path: "/programme", component: ProgrammePage },
  { path: "/items", component: Items },
  { path: "/activities", component: Activities },
  { path: "*", component: NotFound },
];
