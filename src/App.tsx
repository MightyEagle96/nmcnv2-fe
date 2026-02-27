import "bootstrap/dist/css/bootstrap.min.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppUserProvider } from "./context/AppUserContext";
import MainRoutes from "./routes/MainRoutes";
import { ToastContainer } from "react-toastify";
import { RefreshProvider } from "./context/RefreshContext";
import { LoadingProvider } from "./context/LoadingContext";

function App() {
  return (
    <AppUserProvider>
      <RefreshProvider>
        <LoadingProvider>
          <MainRoutes />
          <ToastContainer />
        </LoadingProvider>
      </RefreshProvider>
    </AppUserProvider>
  );
}

export default App;
