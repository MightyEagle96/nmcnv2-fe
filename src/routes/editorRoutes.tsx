import NotFound from "../pages/NotFound";
import EditorHomePage from "../pages/private/caosce/EditorHomePage";

export const editorRoutes = [
  {
    path: "/",
    component: EditorHomePage,
  },
  { path: "*", component: NotFound },
];
