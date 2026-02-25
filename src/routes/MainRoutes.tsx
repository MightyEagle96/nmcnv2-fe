import { useAuth } from "./useAuth";
import LoadingPage from "../components/LoadingPage";
import NotFound from "../pages/NotFound";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/public/LoginPage";
import SignupPage from "../pages/public/SignupPage";
import SideMenuComponents from "../components/SideMenuComponents";
import Dashboard from "../pages/private/Dashboard";

function MainRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingPage />;

  const publicRoutes = [
    { path: "/", component: LoginPage },
    { path: "/signup", component: SignupPage },
    { path: "*", component: NotFound },
  ];

  const privateRoutes = [
    { path: "/", component: Dashboard },
    { path: "*", component: NotFound },
  ];
  return (
    <BrowserRouter>
      {user ? (
        <>
          <div className="row m-0">
            <div className="col-lg-2 py-5 border-end">
              <SideMenuComponents />
            </div>
            <div className="col lg-10 py-5">
              <Routes>
                {privateRoutes.map((c, i) => (
                  <Route key={i} path={c.path} element={<c.component />} />
                ))}
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <>
          <Routes>
            {publicRoutes.map((c, i) => (
              <Route key={i} path={c.path} element={<c.component />} />
            ))}
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default MainRoutes;
