import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppUserProvider } from "./context/AppUserContext";
import MainRoutes from "./routes/MainRoutes";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <AppUserProvider>
      <MainRoutes />
      <ToastContainer />
    </AppUserProvider>
  );
}

export default App;
