import { Button, Typography } from "@mui/material";
import { toastError } from "../../../components/ErrorToast";
import { httpService } from "../../../httpService";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

function CaosceProgrammes() {
  const [programmes, setProgrammes] = useState([]);
  const viewProgrammes = async () => {
    try {
      const { data } = await httpService("caosce/programmes");

      if (data) {
        setProgrammes(data);
        console.log(data);
      }
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    viewProgrammes();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "name", headerName: "Name", width: 300 },
    { field: "procedureCount", headerName: "Procedure Count", width: 300 },
    { field: "itemCount", headerName: "Item Count", width: 300 },
    { field: "activityCount", headerName: "Activity Count", width: 300 },
    {
      field: "_id",
      headerName: "Action",
      renderCell: (params: any) => (
        <Button component={Link} to={`/caosce/programme?id=${params.row._id}`}>
          view
        </Button>
      ),
    },
  ];
  return (
    <div>
      <div className="mb-4">
        <Typography variant="h4" fontWeight={700}>
          PROGRAMMES
        </Typography>
      </div>
      <DataGrid columns={columns} rows={programmes} />
    </div>
  );
}

export default CaosceProgrammes;
