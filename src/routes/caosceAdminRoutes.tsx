import NotFound from "../pages/NotFound";
import CaosceAdminPage from "../pages/private/caosce/CaosceAdminPage";
import CaosceProgrammes from "../pages/private/caosce/CaosceProgrammes";
import ProgrammePage from "../pages/private/caosce/ProgrammePage";

export const caosceAdminRoutes = [
  { path: "/", component: CaosceAdminPage },
  { path: "/programmes", component: CaosceProgrammes },
  { path: "/programme", component: ProgrammePage },
  { path: "*", component: NotFound },
];
