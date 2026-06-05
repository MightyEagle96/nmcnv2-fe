import NotFound from "../pages/NotFound";
import ExaminationCandidates from "../pages/private/admin/ExaminationCandidates";

import ExaminationPage from "../pages/private/admin/ExaminationPage";
import ExaminationSchedule from "../pages/private/admin/ExaminationSchedule";
import ExamSessions from "../pages/private/admin/ExamSessions";
import ProgrammePage from "../pages/private/admin/ProgrammePage";
import User from "../pages/private/admin/User";
import Users from "../pages/private/admin/Users";
import Dashboard from "../pages/private/Dashboard";
import Server from "../pages/private/server/Server";
import AuthoringRoutes from "./AuthoringRoutes";
import CaosceRoutes from "./CaosceRoutes";

export const adminRoutes = [
  { path: "/", component: Dashboard },
  { path: "/servers", component: Server },
  { path: "/examination", component: ExaminationPage },
  { path: "/sessions", component: ExamSessions },
  { path: "/candidates", component: ExaminationCandidates },
  { path: "/schedule", component: ExaminationSchedule },
  { path: "/programmes", component: ProgrammePage },
  { path: "/users", component: Users },
  { path: "/user", component: User },
  { path: "/caosce/*", component: CaosceRoutes },
  { path: "/authoring/*", component: AuthoringRoutes },
  { path: "*", component: NotFound },
];
