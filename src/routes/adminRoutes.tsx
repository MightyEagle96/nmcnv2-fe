import NotFound from "../pages/NotFound";

import ExaminationPage from "../pages/private/admin/ExaminationPage";
import ExaminationSchedule from "../pages/private/admin/ExaminationSchedule";
import ProgrammePage from "../pages/private/admin/ProgrammePage";
import Users from "../pages/private/admin/Users";
import Dashboard from "../pages/private/Dashboard";
import Server from "../pages/private/server/Server";
import AuthoringRoutes from "./AuthoringRoutes";
import CaosceRoutes from "./CaosceRoutes";

export const adminRoutes = [
  { path: "/", component: Dashboard },
  { path: "/servers", component: Server },
  { path: "/examination", component: ExaminationPage },
  { path: "/schedule", component: ExaminationSchedule },
  { path: "/programmes", component: ProgrammePage },
  { path: "/users", component: Users },
  { path: "/caosce/*", component: CaosceRoutes },
  { path: "/authoring/*", component: AuthoringRoutes },
  { path: "*", component: NotFound },
];
