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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  return (
    <AppUserProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <RefreshProvider>
          <LoadingProvider>
            <MainRoutes />
            <ToastContainer />
          </LoadingProvider>
        </RefreshProvider>
      </LocalizationProvider>
    </AppUserProvider>
  );
}

export default App;
