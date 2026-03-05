import NotFound from "../pages/NotFound";
import AuthoringPage from "../pages/private/admin/AuthoringPage";
import ConvertedPage from "../pages/private/admin/ConvertedPage";
import ExaminationPage from "../pages/private/admin/ExaminationPage";
import ExaminationSchedule from "../pages/private/admin/ExaminationSchedule";
import ProgrammePage from "../pages/private/admin/ProgrammePage";
import Dashboard from "../pages/private/Dashboard";
import Server from "../pages/private/server/Server";
import CaosceRoutes from "./CaosceRoutes";

export const adminRoutes = [
  { path: "/", component: Dashboard },
  { path: "/servers", component: Server },
  { path: "/examination", component: ExaminationPage },
  { path: "/schedule", component: ExaminationSchedule },
  { path: "/programmes", component: ProgrammePage },
  { path: "/authoringtool", component: AuthoringPage },
  { path: "/authoringtool/result", component: ConvertedPage },
  { path: "/caosce/*", component: CaosceRoutes },
  { path: "*", component: NotFound },
];
