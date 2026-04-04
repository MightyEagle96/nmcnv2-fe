import NotFound from "../pages/NotFound";

import ExaminationPage from "../pages/private/admin/ExaminationPage";
import ExaminationSchedule from "../pages/private/admin/ExaminationSchedule";
import ProgrammePage from "../pages/private/admin/ProgrammePage";
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
  { path: "/caosce/*", component: CaosceRoutes },
  { path: "/authoring/*", component: AuthoringRoutes },
  { path: "*", component: NotFound },
];
