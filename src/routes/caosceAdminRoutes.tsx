import NotFound from "../pages/NotFound";
import Activities from "../pages/private/caosce/Activities";
import CaosceAdminPage from "../pages/private/caosce/CaosceAdminPage";
import CaosceExamination from "../pages/private/caosce/CaosceExamination";
import CaosceProgrammes from "../pages/private/caosce/CaosceProgrammes";
import ExaminationSchedule from "../pages/private/caosce/ExaminationSchedule";
import Items from "../pages/private/caosce/Items";
import ProcedureInstructions from "../pages/private/caosce/ProcedureInstructions";
import ProcedureRequirements from "../pages/private/caosce/ProcedureRequirements";
import ProgrammePage from "../pages/private/caosce/ProgrammePage";

export const caosceAdminRoutes = [
  { path: "/", component: CaosceAdminPage },
  { path: "/programmes", component: CaosceProgrammes },
  { path: "/programme", component: ProgrammePage },
  { path: "/examination", component: CaosceExamination },
  { path: "/items", component: Items },
  { path: "/activities", component: Activities },
  { path: "/schedule", component: ExaminationSchedule },
  { path: "/requirements", component: ProcedureRequirements },
  { path: "/instructions", component: ProcedureInstructions },
  { path: "*", component: NotFound },
];
