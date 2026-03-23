import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { httpService } from "../../../httpService";
import { DataGrid } from "@mui/x-data-grid";

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
      renderCell: (params) => (
        <span style={{ textTransform: "uppercase" }}>
          {params.row.cbtExamination.name}
        </span>
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
      <DataGrid rows={examinations} columns={columns} />
    </div>
  );
}

export default CaosceExamination;
