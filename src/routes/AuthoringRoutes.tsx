import { Route, Routes } from "react-router-dom";
import ConvertedPage from "../pages/private/authoringTool/ConvertedPage";
import HomePage from "../pages/private/authoringTool/HomePage";

const authoringRoutes = [
  { path: "/", component: HomePage },
  { path: "/result", component: ConvertedPage },
];

function AuthoringRoutes() {
  return (
    <Routes>
      {authoringRoutes.map((c, i) => (
        <Route key={i} path={c.path} element={<c.component />} />
      ))}
    </Routes>
  );
}

export default AuthoringRoutes;
