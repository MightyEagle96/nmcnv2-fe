import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  IconButton,
  TextField,
  Typography,
  MenuItem,
  Menu,
} from "@mui/material";
import { Modal } from "react-bootstrap";
import { LoadingButton } from "@mui/lab";
import { Save, MoreVert } from "@mui/icons-material";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { httpService } from "../../../httpService";
import { useLoading } from "../../../context/LoadingContext";
import { useRefresh } from "../../../context/RefreshContext";
import { toastError } from "../../../components/ErrorToast";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { IProgrammeData } from "../../../types/IProgramme";

type IComponent = {
  name: keyof Pick<
    IProgrammeData,
    "viva" | "procedure" | "research" | "clientCare" | "expectantFamilyCare"
  >;
  label: string;
};
const components: IComponent[] = [
  {
    name: "viva",
    label: "Viva",
  },
  {
    name: "procedure",
    label: "Procedure",
  },
  {
    name: "research",
    label: "Research",
  },
  {
    name: "clientCare",
    label: "Client Care",
  },
  {
    name: "expectantFamilyCare",
    label: "Expectant Family Care",
  },
];

function ProgrammePage() {
  type ProgrammeRow = IProgrammeData & {
    id: number;
  };
  const { loading, setLoading } = useLoading();
  const [programmeData, setProgrammeData] = useState<IProgrammeData>({
    name: "",
    code: "",
    viva: 0,
    procedure: 0,
    research: 0,
    clientCare: 0,
    expectantFamilyCare: 0,
  });
  const [programmes, setProgrammes] = useState<ProgrammeRow[]>([]);
  const [errorCompute, setErrorCompute] = useState<String>("");
  const [total, setTotal] = useState(0);
  const [showCreate, setShowCreate] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    page: 0, // DataGrid uses 0-based index
    pageSize: 50, // rows per page
  });

  const { refresh } = useRefresh();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    const numericValue = type === "number" ? Number(value) : value;

    setProgrammeData((prev) => {
      const updated = {
        ...prev,
        [name]: numericValue,
      };

      const total = components.reduce((sum, c) => {
        return sum + Number(updated[c.name]);
      }, 0);

      if (total > 100) {
        setErrorCompute(`Total must not exceed 100. Current total is ${total}`);
      } else {
        setErrorCompute("");
      }

      return updated;
    });
  };
  const createProgramme = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: "Create new programme",
      text: "Are you sure you want to add this new programme?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);

        try {
          const { data } = await httpService.post(
            "programme/create",
            programmeData,
          );

          if (data) {
            toast.success(data);
            viewProgrammes();
            setShowCreate(false);
          }
        } catch (error) {
          toastError(error);
        }
        setLoading(false);
      }
    });
  };

  const viewProgrammes = async () => {
    try {
      const { data } = await httpService("programme/view");
      if (data) {
        setProgrammes(data.programmes);
        setTotal(data.count);
      }
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    viewProgrammes();
  }, [refresh]);

  const columns: GridColDef<ProgrammeRow>[] = [
    { field: "id", headerName: "S/N", width: 100 },
    {
      field: "name",
      headerName: "Programme Name",
      width: 300,
      renderCell: (params) => (
        <span style={{ textTransform: "capitalize" }}>{params.row.name}</span>
      ),
    },
    {
      field: "code",
      headerName: "Programme Code",
      width: 180,
      renderCell: (params) => (
        <span style={{ textTransform: "uppercase" }}>{params.row.code}</span>
      ),
    },
    ...components.map(
      (c): GridColDef<ProgrammeRow> => ({
        field: c.name,
        headerName: c.label,
        width: 180,
        type: "number",
      }),
    ),
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => <ActionMenu row={params.row} />,
    },
  ];
  return (
    <div>
      {/* <PageTitle title={"Subjects"} /> */}
      <div className="mb-5">
        <Typography variant="h3">Programmes</Typography>
      </div>
      <div>
        <div className="row">
          <div className="col-lg-3">
            <div className="mb-4">
              <Typography>Created Programmes: {total}</Typography>
            </div>
          </div>
          <div className="col-lg-3">
            <Button
              variant="contained"
              onClick={() => setShowCreate(!showCreate)}
            >
              Create new programme
            </Button>
          </div>
        </div>
        <div style={{ maxHeight: "75vh", overflow: "scroll" }}>
          <DataGrid
            columns={columns}
            rows={programmes}
            paginationMode="server"
            rowCount={total}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[50, 100]}
          />
        </div>
      </div>

      <Modal show={showCreate} onHide={() => setShowCreate(!showCreate)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Programme</Modal.Title>
        </Modal.Header>
        <form onSubmit={createProgramme}>
          <Modal.Body className="p-4">
            <div className="mb-3">
              <TextField
                fullWidth
                onChange={handleChange}
                label="Programme Name"
                name="name"
                required
                value={programmeData.name}
              />
            </div>
            <div className="mb-3">
              <TextField
                fullWidth
                onChange={handleChange}
                label="Programme Code"
                name="code"
                required
                value={programmeData.code}
              />
            </div>

            {components.map((c, i) => (
              <div className="mb-3" key={i}>
                <TextField
                  fullWidth
                  onChange={handleChange}
                  label={c.label}
                  name={c.name}
                  required
                  type="number"
                  value={programmeData[c.name]}
                />
              </div>
            ))}

            {errorCompute && <Alert severity="error">{errorCompute}</Alert>}

            <div className="mt-3"></div>
          </Modal.Body>
          <Modal.Footer>
            <LoadingButton
              type="submit"
              loading={loading}
              loadingPosition="end"
              variant="contained"
              endIcon={<Save />}
              disabled={errorCompute?.length > 0}
            >
              Create Programme
            </LoadingButton>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default ProgrammePage;

type ActionMenuProps = {
  row: IProgrammeData; // you can strongly type this later
};

function ActionMenu({ row }: ActionMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [errorCompute, setErrorCompute] = useState<string>("");

  const { refresh, setRefresh } = useRefresh();

  const { loading, setLoading } = useLoading();

  const [programmeData, setProgrammeData] = useState<IProgrammeData>({
    name: "",
    code: "",
    viva: 0,
    procedure: 0,
    research: 0,
    clientCare: 0,
    expectantFamilyCare: 0,
  });

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    // Initialize form with current row data
    setProgrammeData({ ...row });
    setShowEdit(true);
    handleClose();
  };

  const handleDelete = () => {
    console.log("Delete row:", row);
    handleClose();

    Swal.fire({
      icon: "question",
      title: "Delete Programme",
      text: "Are you sure you want to delete this programme?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const { data } = await httpService.delete(
            `programme/delete/${row._id}`,
          );
          if (data) {
            toast.success(data);
            setRefresh(!refresh);
          }
          setLoading(false);
        } catch (error) {
          toastError(error);
        }
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const numericValue = type === "number" ? Number(value) : value;

    setProgrammeData((prev) => {
      const updated = { ...prev, [name]: numericValue };

      // Compute total
      const total = components.reduce(
        (sum, c) => sum + Number(updated[c.name]),
        0,
      );

      if (total > 100) {
        setErrorCompute(`Total must not exceed 100. Current total is ${total}`);
      } else {
        setErrorCompute("");
      }

      return updated;
    });
  };

  const editProgramme = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Swal.fire({
      icon: "question",
      title: "Update this programme",
      text: "Are you sure you want to update this programme?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);

        try {
          const { data } = await httpService.patch(
            "programme/update",
            programmeData,
          );

          if (data) {
            setRefresh(!refresh);
            toast.success(data);

            setShowEdit(false);
          }
        } catch (error) {
          toastError(error);
        }
        setLoading(false);
      }
    });
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVert />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      <Modal
        show={showEdit}
        onHide={() => setShowEdit(false)}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Programme</Modal.Title>
        </Modal.Header>

        <form onSubmit={editProgramme}>
          <Modal.Body className="p-4">
            <div className="mb-3">
              <TextField
                fullWidth
                onChange={handleChange}
                label="Programme Name"
                name="name"
                required
                value={programmeData.name}
              />
            </div>
            <div className="mb-3">
              <TextField
                fullWidth
                onChange={handleChange}
                label="Programme Code"
                name="code"
                required
                value={programmeData.code}
              />
            </div>

            {components.map((c) => (
              <div className="mb-3" key={c.name}>
                <TextField
                  fullWidth
                  onChange={handleChange}
                  label={c.label}
                  name={c.name}
                  required
                  type="number"
                  value={programmeData[c.name]}
                />
              </div>
            ))}

            {errorCompute && <Alert severity="error">{errorCompute}</Alert>}
          </Modal.Body>

          <Modal.Footer>
            <LoadingButton
              type="submit"
              loading={loading}
              loadingPosition="end"
              variant="contained"
              disabled={!!errorCompute}
            >
              Edit Programme
            </LoadingButton>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
