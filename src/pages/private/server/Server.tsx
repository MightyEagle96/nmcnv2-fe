import { useEffect } from "react";
import { toastError } from "../../../components/ErrorToast";
import { httpService } from "../../../httpService";
import { Typography } from "@mui/material";
import { HomeWork } from "@mui/icons-material";

type ICentre = {
  centreId: string;
  password: string;
  state: string;
  name: string;
  capacity: number;
};
const Server = () => {
  const getServers = async () => {
    try {
      const { data } = await httpService("server/viewall");
      console.log(data);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    getServers();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "centreId", headerName: "Centre ID", width: 100 },
  ];
  return (
    <div>
      <div className="mb-5">
        <Typography variant="h4" fontWeight={700}>
          SERVER MANAGEMENT
        </Typography>
      </div>
      <div className="row mb-3">
        <div className="col-lg-4 m-1 rounded border p-3 d-flex justify-content-between align-items-center">
          <div>
            <Typography variant="overline">Total servers</Typography>
            <Typography variant="h4">10</Typography>
          </div>
          <div>
            <HomeWork sx={{ height: 70, width: 70 }} />
          </div>
        </div>
        <div className="col-lg-4 m-1 rounded border p-3 d-flex justify-content-between align-items-center">
          <div>
            <Typography variant="overline">
              Selected for active examination
            </Typography>
            <Typography variant="h4">10</Typography>
          </div>
          <div>
            <HomeWork sx={{ height: 70, width: 70 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Server;
