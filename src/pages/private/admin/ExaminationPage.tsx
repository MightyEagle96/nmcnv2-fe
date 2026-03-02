import {
  Button,
  Checkbox,
  CircularProgress,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Modal, Nav, Table } from "react-bootstrap";
import { httpService } from "../../../httpService";

import { LoadingButton } from "@mui/lab";
import Swal from "sweetalert2";
import { Clear, Delete, Done } from "@mui/icons-material";

import { toast } from "react-toastify";

import type { AxiosError } from "axios";
import { toastError, toastSuccess } from "../../../components/ErrorToast";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

function ExaminationPage() {
  const [selectedProgrammes, setSelectedProgrammes] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [examinations, setExaminations] = useState([]);
  const [show, setShow] = useState(false);

  const [examination, setExamination] = useState({});

  const [loading, setLoading] = useState(false);

  const getExaminations = async () => {
    setLoading(true);
    const { data } = await httpService("cbt/view");
    if (data) {
      console.log(data);
      setExaminations(data.examinations);
    }
    setLoading(false);
  };

  const getProgrammes = async () => {
    try {
      const { data } = await httpService("programme/view");

      if (data) {
        setProgrammes(data.programmes);
      }

      // if (error) toast.error(error);
    } catch (error) {
      const err = error as AxiosError;

      if (err.response?.data) {
        toast.error(err.response?.data as string);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const selectSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProgrammes([...selectedProgrammes, e.target.value]);
    } else {
      setSelectedProgrammes(
        selectedProgrammes.filter((c) => c !== e.target.value),
      );
    }
  };

  const createExamination = () => {
    if (!examination?.name)
      return Swal.fire({
        icon: "warning",
        title: "No examination name",
        text: "Please enter a name for this examination",
      });

    if (selectedProgrammes.length === 0)
      return Swal.fire({
        icon: "warning",
        title: "No subject selected",
        text: "Please select programmes for this examination",
      });

    Swal.fire({
      icon: "question",
      title: "Create Examination",
      text: "Are you sure you want to create this examination?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await httpService.post("cbt/create", {
            ...examination,
            programmes: selectedProgrammes,
          });

          if (data) {
            setShow(!show);
            toastSuccess(data);

            getExaminations();
          }
          //  if (error) toast.error(error);
        } catch (error) {
          toastError(error);
        } finally {
          setLoading(false);
        }
      }
    });
  };
  useEffect(() => {
    getExaminations();

    getProgrammes();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "S/N",
      width: 70,
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params: any) => {
        return (
          <Tooltip title={params.row.name}>
            <span
              style={{
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
                textTransform: "uppercase",
              }}
            >
              {params.row.name}
            </span>
          </Tooltip>
        );
      },
    },
    {
      field: "programmes",
      headerName: "Programmes",
      width: 400,
      renderCell: (params: any) => {
        const programmesString = params.row.programmes
          .map((p: any) => p.name.toUpperCase())
          .join(", ");

        return (
          <Tooltip title={programmesString}>
            <span
              style={{
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {programmesString}
            </span>
          </Tooltip>
        );
      },
    },

    {
      field: "active",
      headerName: "Active",
      width: 100,
      renderCell: (params: any) => {
        return params.row.active ? (
          <Done color="success" />
        ) : (
          <Clear color="error" />
        );
      },
    },
    {
      field: "candidates",
      headerName: "Candidates",
      width: 100,
      renderCell: (params: any) => <Button>view</Button>,
    },
    {
      field: "schedule",
      headerName: "Schedule",
      width: 100,
      renderCell: (params: any) => (
        <Button component={Link} to={`/schedule?examination=${params.row._id}`}>
          view
        </Button>
      ),
    },

    {
      field: "sessions",
      headerName: "Sessions",
      width: 100,
      renderCell: (params: any) => (
        <Button component={Link} to={`/schedule?examination=${params.row._id}`}>
          view
        </Button>
      ),
    },
    {
      field: "results",
      headerName: "Results",
      width: 100,
      renderCell: (params: any) => <Button>view</Button>,
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params: any) => {
        return (
          <DeleteExam id={params.row.id} getExaminations={getExaminations} />
        );
      },
    },
  ];

  return (
    <div>
      {/* <PageTitle title={"Examinations"} /> */}
      <div className="mb-5">
        <Typography variant="h3" fontWeight={500}>
          Examinations
        </Typography>
      </div>
      <div>
        <div className=" mb-3">
          <Stack direction={"row"} spacing={2}>
            <div>
              <Button
                sx={{ textTransform: "capitalize" }}
                onClick={() => setShow(!show)}
                variant="contained"
              >
                Create Examination
              </Button>
            </div>
            <div className="d-flex align-items-center">
              {loading && <CircularProgress size={20} color="warning" />}
            </div>
          </Stack>
        </div>
        {/* <Table bordered>
          <thead className="">
            <tr className="text-center text-uppercase fw-700">
              <th>S/N</th>
              <th>Name</th>
              <th>Active</th>
              <th>Subjects</th>
              <th>Results</th>

              <th>Schedule</th>

              <th>Sessions</th>
              <th>Candidates</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {examinations.map((c: any, i) => (
              <tr className="align-middle text-center" key={i}>
                <td>{i + 1}</td>
                <td className="text-capitalize">
                  <Typography variant="body1">{c.name}</Typography>
                </td>
                <td>
                  {c.active ? (
                    <Done color="success" />
                  ) : (
                    <Clear color="error" />
                  )}
                </td>
                <td className="col-lg-5">
                  <div className="row">
                    {c.programmes.map((d: any, j: number) => (
                      <div className="col-lg-3 m-1">
                        <div>
                          <Typography
                            variant="body2"
                            fontWeight={400}
                            textTransform={"capitalize"}
                          >
                            {d.name}
                          </Typography>
                          <Typography color={"GrayText"} variant="overline">
                            {d.code}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <Nav.Link key={i} as={Link} to={`/results/${c._id}`}>
                    <Typography variant="body2" color={"info"}>
                      View Results
                    </Typography>
                  </Nav.Link>
                </td>
                <td>
                  <Nav.Link
                    key={i}
                    as={Link}
                    to={`/examinations/questionbanks/${c._id}`}
                  >
                    <Typography variant="body2" color={"warning"}>
                      View
                    </Typography>
                  </Nav.Link>
                </td>
                <td>
                  <Nav.Link
                    key={i}
                    as={Link}
                    to={`/examinations/sessions/${c._id}`}
                  >
                    <Typography variant="body2" color={"success"}>
                      View
                    </Typography>
                  </Nav.Link>
                </td>
                <td>
                  <Nav.Link
                    key={i}
                    as={Link}
                    to={`/examinations/candidates/${c._id}`}
                  >
                    <Typography variant="body2" color={"error"}>
                      View
                    </Typography>
                  </Nav.Link>
                </td>

                <td>
                  <DeleteExam id={c._id} getExaminations={getExaminations} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table> */}

        <DataGrid rows={examinations} columns={columns} loading={loading} />
      </div>
      <Modal
        centered
        onHide={() => {
          setShow(!show);
          setSelectedProgrammes([]);
        }}
        show={show}
        size="xl"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create a new examination</Modal.Title>
        </Modal.Header>
        <form>
          <Modal.Body>
            <div className="col-lg-6 mb-4">
              <div className="mb-3">
                <TextField
                  required
                  fullWidth
                  label="Examination Name"
                  onChange={(e) =>
                    setExamination({ ...examination, name: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <div style={{ maxHeight: "60vh", overflow: "scroll" }}>
                <Table striped borderless>
                  <thead>
                    <tr>
                      <th>S/N</th>
                      <th>Name</th>
                      <th>Code</th>
                      <th>Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programmes.map((c: any, i) => (
                      <tr key={i}>
                        <td>
                          <small>{i + 1}</small>
                        </td>
                        <td>
                          <small className="text-uppercase">{c.name}</small>
                        </td>
                        <td>
                          <small className="text-uppercase">{c.code}</small>
                        </td>
                        <td>
                          <Checkbox onChange={selectSubject} value={c._id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Stack
              className="d-flex align-items-center"
              direction={"row"}
              spacing={2}
            >
              <div>
                <Typography>
                  Selected programs:{" "}
                  <strong>{selectedProgrammes.length}</strong>
                </Typography>
              </div>
              <div>
                <LoadingButton
                  onClick={createExamination}
                  color="success"
                  variant="contained"
                >
                  create examination
                </LoadingButton>
              </div>
            </Stack>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default ExaminationPage;

function DeleteExam({ id, getExaminations }: any) {
  const [loading, setLoading] = useState(false);
  const deleteExam = () => {
    Swal.fire({
      icon: "question",
      title: "Delete Examination",
      showCancelButton: true,
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      text: "Are you sure you want to delete this examination?\nThis will delete all candidates registered for this examination alongside the results for these candidates",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);

        try {
          const { data } = await httpService.delete(`cbt/delete/${id}`);

          if (data) {
            getExaminations();
            toast.success(data);
          }

          setLoading(false);
        } catch (error) {
          toastError(error);
        }
      }
    });
  };
  return (
    <LoadingButton
      endIcon={<Delete />}
      color="error"
      sx={{ textTransform: "capitalize" }}
      loadingPosition="end"
      loading={loading}
      onClick={deleteExam}
    >
      Delete
    </LoadingButton>
    // <IconButton onClick={deleteExam}>
    //   {loading ? <CircularProgress size={15} /> : <Delete />}
    // </IconButton>
  );
}
