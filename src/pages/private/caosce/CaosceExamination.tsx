import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { httpService } from "../../../httpService";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

function CaosceExamination() {
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const getExaminations = async () => {
    setLoading(true);
    const { data } = await httpService("caosce/examinations");
    if (data) {
      console.log(data);
      setExaminations(data.examinations);
    }
    setLoading(false);
  };

  useEffect(() => {
    getExaminations();
  }, []);

  const columns = [
    { field: "id", headerName: "S/N", width: 70 },
    {
      field: "name",
      headerName: "Name",
      width: 300,
      renderCell: (params: any) => (
        <span style={{ textTransform: "uppercase" }}>
          {params.row.cbtExamination.name}
        </span>
      ),
    },
    {
      field: "active",
      headerName: "Active Status",
      width: 300,
      renderCell: (params: any) =>
        params.row.active ? (
          <Button color="error">Deactivate</Button>
        ) : (
          <Button color="success">Activate</Button>
        ),
    },
    {
      field: "schedule",
      headerName: "View Schedule",
      width: 300,
      renderCell: (params: any) => (
        <Button
          component={Link}
          to={`/caosce/schedule?caosce=${params.row._id}`}
        >
          View
        </Button>
      ),
    },
  ];
  return (
    <div>
      <div className="mb-4">
        <Typography variant="h4" fontWeight={700}>
          CAOSCE EXAMINATION
        </Typography>
      </div>
      <DataGrid rows={examinations} columns={columns} loading={loading} />
    </div>
  );
}

export default CaosceExamination;
