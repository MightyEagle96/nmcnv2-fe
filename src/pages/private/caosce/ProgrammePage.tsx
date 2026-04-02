import React, { useEffect, useState } from "react";
import { toastError } from "../../../components/ErrorToast";
import { httpService } from "../../../httpService";
import { Link, useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
  Clear,
  Delete,
  Done,
  FileCopy,
  MoreVert,
  PlusOne,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useRefresh } from "../../../context/RefreshContext";
import { FaEdit } from "react-icons/fa";

type IProgrammeData = {
  name: string;
  code: string;
  viva: number;
  procedure: number;
  research: number;
  clientCare: number;
  expectantFamilyCare: number;
  _id?: string;
  itemCount: number;
  activityCount: number;
  procedureCount: number;
};

type IProcedureData = {
  name: string;
  code: string;
  _id?: string;
  itemCount: number;
  activityCount: number;
  procedureCount: number;
  hasRequirements: boolean;
  hasInstructions: boolean;
};

function ProgrammePage() {
  const [params] = useSearchParams();
  const [programmeData, setProgrammeData] = useState<IProgrammeData>({
    name: "",
    code: "",
    viva: 0,
    procedure: 0,
    research: 0,
    clientCare: 0,
    expectantFamilyCare: 0,
    itemCount: 0,
    activityCount: 0,
    procedureCount: 0,
  });
  const [programmeProcedures, setProgrammeProcedures] = useState([]);
  const [show, setShow] = useState(false);
  const [creating, setCreating] = useState(false);
  const [procedureData, setProcedureData] = useState({
    name: "",
    code: "",
  });

  const [codeError, setCodeError] = useState("");

  const [nameError, setNameError] = useState("");

  const { refresh, setRefresh } = useRefresh();

  const [loading, setLoading] = useState(false);

  const _id = params.get("id");
  const viewProgramme = async () => {
    try {
      const { data } = await httpService("caosce/programme", {
        params: { _id },
      });
      if (data) {
        setProgrammeData(data);
      }
    } catch (error) {
      toastError(error);
    }
  };

  const viewProgrammeProcedures = async () => {
    setLoading(true);
    try {
      const { data } = await httpService("caosce/programmeprocedures", {
        params: { _id },
      });
      if (data) {
        setProgrammeProcedures(data);
        console.log(data);
      }
    } catch (error) {
      toastError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (_id) {
      Promise.all([viewProgramme(), viewProgrammeProcedures()]);
    }
  }, [_id, refresh]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    Swal.fire({
      icon: "question",
      title: "Add Procedure",
      text: "Are you sure you want to add this procedure  ",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setCreating(true);
        try {
          const { data } = await httpService.post("caosce/createprocedure", {
            ...procedureData,
            programme: _id,
          });
          viewProgramme();
          toast.success(data);

          setRefresh(!refresh);

          setProcedureData({
            name: "",
            code: "",
          });
          setShow(false);
        } catch (error) {
          toastError(error);
        }
        setCreating(false);
      }
    });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params: any) => (
        <span style={{ textTransform: "uppercase" }}>{params.row.name}</span>
      ),
    },
    {
      field: "code",
      headerName: "Code",
      width: 150,
      renderCell: (params: any) => (
        <span style={{ textTransform: "uppercase" }}>{params.row.code}</span>
      ),
    },
    {
      field: "itemCount",
      headerName: "Items",
      width: 130,
      renderCell: (params: any) => (
        <Typography
          sx={{ textDecoration: "none", fontSize: 14 }}
          component={Link}
          to={`/caosce/items?id=${params.row._id}&procedure=${params.row.name}&programme=${_id}&programmename=${programmeData?.name}`}
        >
          <span>{params.row.itemCount}</span>
        </Typography>
      ),
    },
    {
      field: "activityCount",
      headerName: "Activities",
      width: 130,
      renderCell: (params: any) => (
        <Typography
          sx={{ textDecoration: "none", fontSize: 14 }}
          component={Link}
          to={`/caosce/activities?id=${params.row._id}&procedure=${params.row.name}&programme=${_id}&programmename=${programmeData?.name}`}
        >
          <span>{params.row.activityCount}</span>
        </Typography>
      ),
    },
    {
      field: "requirement",
      headerName: "Requirements",
      width: 130,
      renderCell: (params: any) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              size="small"
              sx={{ textTransform: "none" }}
              component={Link}
              to={`/caosce/requirements?programme=${_id}&procedure=${params.row._id}&name=${params.row.name}`}
            >
              View
            </Button>

            {params.row.hasRequirements ? (
              <Done color="success" fontSize="small" />
            ) : (
              <Clear color="error" fontSize="small" />
            )}
          </Stack>
        </Box>
      ),
    },
    {
      field: "instruction",
      headerName: "Instructions",
      width: 130,
      renderCell: (params: any) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              size="small"
              sx={{ textTransform: "none" }}
              component={Link}
              to={`/caosce/instructions?programme=${_id}&procedure=${params.row._id}&name=${params.row.name}`}
            >
              View
            </Button>

            {params.row.hasInstructions ? (
              <Done color="success" fontSize="small" />
            ) : (
              <Clear color="error" fontSize="small" />
            )}
          </Stack>
        </Box>
      ),
    },
    {
      field: "maxScore",
      headerName: "Max Score",
      width: 130,
      renderCell: (params: any) => params.row.maxScore,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params: any) => <ActionMenu row={params.row} />,
    },
  ];

  return (
    <div>
      {programmeData && (
        <div>
          <div className="d-flex justify-content-between mb-4">
            <div>
              <Typography
                gutterBottom
                variant="h4"
                textTransform={"uppercase"}
                fontWeight={700}
              >
                {" "}
                {programmeData.name}
              </Typography>
            </div>
            <div className="col-lg-3">
              <Alert severity="info">
                MAX PROCEDURE SCORE: <b>{programmeData.procedure}</b>
              </Alert>
              <Button onClick={() => setShow(!show)}>add new prodedure</Button>
            </div>
          </div>
          <div className="p-3 col-lg-6  rounded bg-light text-muted shadow-sm">
            <div className="d-flex justify-content-between text-center pb-2 border-bottom mb-3">
              <div className="col-lg-2">
                <Typography variant="body2">Procedures</Typography>
              </div>
              <div className="col-lg-2">
                <Typography variant="body2">Items Count</Typography>
              </div>
              <div className="col-lg-2">
                <Typography variant="body2">Activities Count</Typography>
              </div>
            </div>

            <div className="d-flex justify-content-between text-center">
              <div className="col-lg-2">
                <Typography variant="h4">
                  {programmeData.procedureCount}
                </Typography>
              </div>
              <div className="col-lg-2">
                <Typography variant="h4">{programmeData.itemCount}</Typography>
              </div>
              <div className="col-lg-2">
                <Typography variant="h4">
                  {programmeData.activityCount}
                </Typography>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div style={{ height: "50vh", overflow: "scroll" }}>
              <DataGrid
                loading={loading}
                rows={programmeProcedures}
                columns={columns}
                rowCount={programmeProcedures.length}
              />
            </div>
          </div>
        </div>
      )}
      <Modal
        show={show}
        backdrop="static"
        centered
        onHide={() => {
          setShow(false);
          setProcedureData({
            name: "",
            code: "",
          });
        }}
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Add new procedure</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <div className="mb-3">
              <TextField
                required
                fullWidth
                label="Name"
                value={procedureData.name}
                error={!!nameError}
                helperText={nameError}
                onChange={(e) => {
                  const value = e.target.value;

                  setProcedureData({ ...procedureData, name: value });

                  if (value.length < 10) {
                    setNameError("Name must be at least 10 characters");
                  } else {
                    setNameError("");
                  }
                }}
              />
            </div>
            <div className="mb-3">
              <TextField
                required
                fullWidth
                label="Code"
                value={procedureData.code}
                error={!!codeError}
                helperText={codeError}
                onChange={(e) => {
                  const value = e.target.value;

                  setProcedureData({ ...procedureData, code: value });

                  if (value.length < 3) {
                    setCodeError("Code must be at least 3 characters");
                  } else {
                    setCodeError("");
                  }
                }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 bg-dark">
            <Button
              disabled={codeError !== "" || nameError !== ""}
              type="submit"
              color="error"
              variant="contained"
              endIcon={<PlusOne />}
              loading={creating}
              loadingPosition="end"
            >
              add procedure
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default ProgrammePage;

type ActionMenuProps = {
  row: IProcedureData; // you can strongly type this later
};

function ActionMenu({ row }: ActionMenuProps) {
  const [params] = useSearchParams();
  const _id = params.get("id");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [showCopy, setShowCopy] = useState(false);

  const [selectedProgrammes, setSelectedProgrammes] = useState<string[]>([]);
  const [programmes, setProgrammes] = useState<IProgrammeData[]>([]);
  const [copying, setCopying] = useState(false);
  const [loading, setLoading] = useState(false);
  //const [procedure, setProcedure] = useState<IProcedureData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { refresh, setRefresh } = useRefresh();

  const handleProgrammeChange = (programmeId: string) => {
    setSelectedProgrammes((prev) => {
      if (prev.includes(programmeId)) {
        // Deselect
        return prev.filter((id) => id !== programmeId);
      } else {
        // Select
        return [...prev, programmeId];
      }
    });
  };

  const copyProcedureToProgrammes = () => {
    Swal.fire({
      icon: "question",
      text: "Are you sure you want to copy this procedure to the selected programmes",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setCopying(true);
          const { data } = await httpService.post(
            "caosce/copyproceduretoprogramme",
            {
              selectedProgrammes,
              procedureId: row?._id || "",
            },
          );

          toast.success(data);
          setShowCopy(false);
          setSelectedProgrammes([]);
        } catch (error) {
          toastError(error);
        } finally {
          setCopying(false);
        }
        console.log({ selectedProgrammes });
      }
    });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleModalClose = () => {
    setShowCopy(false);
    setSelectedProgrammes([]);
    //setProcedure(null);
  };
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = () => {
    Swal.fire({
      icon: "question",
      text: "Are you sure you want to delete this procedure",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setDeleting(true);
          const { data } = await httpService.delete(
            `caosce/deleteprocedure?procedureId=${row._id}`,
          );
          if (data) {
            toast.success(data);
            handleModalClose();

            setRefresh(!refresh);
          }
        } catch (error) {
          toastError(error);
        } finally {
          setDeleting(false);
        }
      }
    });
  };

  const fetchProgrammes = async () => {
    setLoading(true);
    try {
      const { data } = await httpService(
        "caosce/fetchprogrammeswithexception",
        {
          params: { id: _id },
        },
      );
      if (data) {
        setProgrammes(data);
        setShowCopy(true);
        console.log(data);
        // setProgrammeData(data);
      }
    } catch (error) {
      setShowCopy(false);
      toastError(error);
    }
    //setProgrammeProcedures(data);
    setLoading(false);
  };

  const handleEdit = () => {};
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVert />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem sx={{ mb: 1 }} onClick={handleEdit}>
          <Typography color="info">
            Edit {"  "} <FaEdit />
          </Typography>
        </MenuItem>

        <MenuItem
          sx={{ mb: 1 }}
          onClick={() => {
            handleMenuClose(); // close menu first
            fetchProgrammes(); // then open modal
          }}
        >
          <Typography color="success">
            Copy
            {copying ? (
              <CircularProgress sx={{ ml: 1 }} size={15} color="success" />
            ) : (
              <FileCopy sx={{ ml: 1 }} />
            )}
          </Typography>
        </MenuItem>
        <MenuItem sx={{ mb: 1 }} onClick={handleDelete}>
          <Typography color="error">
            Delete
            {deleting ? (
              <CircularProgress sx={{ ml: 1 }} size={15} color="error" />
            ) : (
              <Delete sx={{ ml: 1 }} />
            )}
          </Typography>
        </MenuItem>
      </Menu>

      <Modal
        show={showCopy}
        backdrop="static"
        centered
        onHide={handleModalClose}
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Programmes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-3">
            <div className="alert alert-light border-0">
              <Typography variant="caption" gutterBottom>
                {" "}
                Procedure summary
              </Typography>

              <Stack>
                <Typography textTransform={"uppercase"} variant="body2">
                  {row?.name}{" "}
                  <span className="fw-bold text-success">({row?.code})</span>
                </Typography>
              </Stack>
            </div>
            <FormGroup>
              {programmes.map((programme) => (
                <div>
                  <FormControlLabel
                    key={programme._id}
                    control={
                      <Checkbox
                        checked={selectedProgrammes.includes(
                          programme._id || "",
                        )}
                        onChange={() =>
                          handleProgrammeChange(programme._id || "")
                        }
                      />
                    }
                    label={
                      <Typography variant="body2" textTransform={"uppercase"}>
                        {programme.name}
                      </Typography>
                    }
                  />
                </div>
              ))}
            </FormGroup>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button
            disabled={!selectedProgrammes.length}
            color="error"
            onClick={copyProcedureToProgrammes}
            loading={loading}
          >
            COPY PROCEDURE TO SELECTED PROGRAMME
            {selectedProgrammes.length > 1 ? "S" : ""}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
