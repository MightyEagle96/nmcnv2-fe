import NotFound from "../pages/NotFound";
import ExaminationPage from "../pages/private/admin/ExaminationPage";
import ProgrammePage from "../pages/private/admin/ProgrammePage";
import Dashboard from "../pages/private/Dashboard";
import Server from "../pages/private/server/Server";

export const adminRoutes = [
  { path: "/", component: Dashboard },
  { path: "/servers", component: Server },
  { path: "/examination", component: ExaminationPage },
  { path: "/programmes", component: ProgrammePage },
  { path: "*", component: NotFound },
];
