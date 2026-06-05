import { Typography } from "@mui/material";
import { useEffect, useState } from "react";

//import { AlertContext } from "../../context/AlertContext";
import { LoadingButton } from "@mui/lab";
import { useSearchParams } from "react-router-dom";

import { Delete, Upload } from "@mui/icons-material";

import Swal from "sweetalert2";
import PageTitle from "../../../components/PageTitle";

import { toast } from "react-toastify";
import { httpService } from "../../../httpService";
import { toastError } from "../../../components/ErrorToast";
import { DataGrid } from "@mui/x-data-grid";

function ExaminationCandidates() {
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [totalCandidates, setTotalCandidates] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [assigned, setAssigned] = useState(0);
  const [unassigned, setUnassigned] = useState(0);
  const [errorCandidates, setErrorCandidates] = useState(0);

  const [deleting, setDeleting] = useState(false);

  const [params] = useSearchParams();

  const [paginationModel, setPaginationModel] = useState({
    page: 0, // DataGrid uses 0-based index
    pageSize: 50, // rows per page
  });

  const examination = params.get("examination");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const deleteCandidates = () => {
    Swal.fire({
      icon: "question",
      title: "Are you sure you want to delete candidates",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeleting(true);

        try {
          const { data } = await httpService.delete(
            `candidate/deletemany/${examination}`,
          );

          if (data) {
            getCandidates();
            toast.success(data);
          }
        } catch (error) {
          toastError(error);
        }

        setDeleting(false);
      }
    });
  };
  const uploadFile = async () => {
    const formData = new FormData();

    if (!file) return;
    setLoading(true);
    //console.log(file.name);
    formData.append("testform", file, file.name);

    try {
      const { data } = await httpService.post(
        `/candidate/uploadfile/${examination}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      if (data) {
        getCandidates();
        toast.success(data);
      }
    } catch (error) {
      toastError(error);
    }

    setLoading(false);
  };

  const getCandidates = async () => {
    setLoading(true);
    try {
      const { data } = await httpService(`candidate/view/${examination}`, {
        params: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
        },
      });
      if (data) {
        setTotalCandidates(data.count);
        setAssigned(data.assigned);
        setUnassigned(data.unassigned);
        setErrorCandidates(data.error);
        setCandidates(data.candidates);
      }
      console.log(data);
    } catch (error) {
      toastError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCandidates();
  }, [paginationModel]);

  const columns = [
    { field: "id", headerName: "S/N", width: 70 },
    {
      field: "candidate",
      headerName: "Candidate",
      width: 300,
      renderCell: (params: any) => (
        <span style={{ textTransform: "uppercase" }}>
          {params.row.firstName} {params.row.lastName} {params.row.middleName}
        </span>
      ),
    },
    {
      field: "indexNumber",
      headerName: "Index Number",
      width: 300,
      renderCell: (params: any) => (
        <span style={{ textTransform: "uppercase" }}>
          {params.row.indexNumber}
        </span>
      ),
    },
    {
      field: "programme",
      headerName: "Programme",
      width: 300,
      renderCell: (params: any) =>
        params.row.programmes.length > 0 ? (
          <span style={{ textTransform: "uppercase" }}>
            {params.row.programmes[0]?.name} ({params.row.programmes[0]?.code})
          </span>
        ) : (
          <span
            className="text-danger"
            style={{ textTransform: "uppercase", fontWeight: 700 }}
          >
            ERROR PROGRAMME - ({params.row.programmeCodes})
          </span>
        ),
    },
    {
      field: "center",
      headerName: "Centre",
      width: 300,
      renderCell: (params: any) => (
        <div>
          <span style={{ textTransform: "uppercase" }}>
            {params.row.centre?.centreId}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="">
        <PageTitle title="Examination Candidates" />

        <div className="row">
          <div className="col-lg-4">
            <div>
              <label for="testform" className="form-label">
                Upload candidate's excel file
              </label>
              <input
                className="form-control"
                type="file"
                id="testform"
                name="testform"
                accept=".csv, .xlsx"
                onChange={handleChange}
              />
              {file && (
                <Typography fontWeight={600} color={"GrayText"}>
                  {file.name}
                </Typography>
              )}
              <div className="mt-2">
                <LoadingButton
                  variant="contained"
                  color="warning"
                  loadingPosition="end"
                  endIcon={<Upload />}
                  loading={loading}
                  onClick={uploadFile}
                  disabled={!file ? true : false}
                >
                  Upload file
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>

        <div className="row text-muted p-3">
          <div className="col-lg-2 p-3 me-2 mb-2 bg-light">
            <small>Total Candidates</small>
            <h4>{totalCandidates?.toLocaleString()}</h4>
          </div>
          <div className="col-lg-2 p-3 me-2 mb-2 bg-light">
            <small>Assigned Candidates</small>
            <h4>{assigned?.toLocaleString()}</h4>
          </div>
          <div className="col-lg-2 p-3 me-2 mb-2 bg-light">
            <small>Unassigned Candidates</small>
            <h4>{unassigned?.toLocaleString()}</h4>
          </div>
          <div
            className={
              errorCandidates > 0
                ? "col-lg-2 p-3 me-2 mb-2 bg-danger text-light"
                : "col-lg-2 p-3 me-2 mb-2 bg-success text-light"
            }
          >
            <small>Error Candidates</small>
            <h4>{errorCandidates?.toLocaleString()}</h4>
          </div>
        </div>
        <div className="text-end mb-3">
          <LoadingButton
            onClick={deleteCandidates}
            loading={deleting}
            variant="contained"
            color="error"
            endIcon={<Delete />}
          >
            Delete Candidates
          </LoadingButton>
        </div>

        <div>
          <DataGrid
            columns={columns}
            rowCount={totalCandidates}
            paginationModel={paginationModel}
            paginationMode="server"
            onPaginationModelChange={setPaginationModel}
            rows={candidates}
          />
        </div>
      </div>
    </div>
  );
}

export default ExaminationCandidates;
