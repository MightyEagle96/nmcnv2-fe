import {
  Clear,
  Done,
  Visibility,
  VisibilityOff,
  Close,
} from "@mui/icons-material";

import {
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import { httpService } from "../../../httpService";
import { toastError } from "../../../components/ErrorToast";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";

export interface IAccount {
  firstName: string;
  lastName: string;

  password: string;
  username: string;
  role: string;
  _id: string;
}

function Users() {
  const roles = {
    admin: "Admin",
    synchronizer: "Synchronizer",
    caosceAdmin: "Caosce Admin",
    questionBankEditor: "Question Bank Editor",
  };

  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IAccount[]>([]);
  const [open, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "firstName",
      headerName: "First Name",
      width: 200,
      renderCell: (params: any) => (
        <span className="text-capitalize">{params.row.firstName}</span>
      ),
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 200,
      renderCell: (params: any) => (
        <span className="text-capitalize">{params.row.lastName}</span>
      ),
    },
    {
      field: "username",
      headerName: "Username",
      width: 200,
      renderCell: (params: any) => <span>{params.row.username}</span>,
    },

    {
      field: "active",
      headerName: "Role",
      width: 150,
      renderCell: (params: any) => (
        <span>{roles[params.row.role as keyof typeof roles]}</span>
      ),
    },
    {
      field: "disabled",
      headerName: "Active",
      width: 150,
      renderCell: (params: any) => (
        <span>
          {!params.row.disabled ? (
            <Done color="success" />
          ) : (
            <Clear color="error" />
          )}
        </span>
      ),
    },
    {
      field: "_id",
      headerName: "Vew",
      width: 150,
      renderCell: (params: any) => (
        <Button component={Link} to={`/user?id=${params.row._id}`}>
          view
        </Button>
      ),
    },
  ];

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await httpService("account/users");
      setUsers(response.data);
    } catch (error) {
      toastError(error);
    }
    setLoading(false);
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await httpService.post("account/create", userData);
      getUsers();
      toast.success(response.data);
    } catch (error) {
      toastError(error);
    } finally {
      // setUserData({});
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      <div className="mb-5">
        <h1>Users Management Console</h1>
      </div>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Create User
      </Button>

      <div className="my-5">
        <DataGrid rows={users} columns={columns} loading={loading} />
      </div>
      <Modal backdrop="static" show={open} onHide={() => setOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={createUser}>
            <div className="">
              <div className="mb-3">
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <TextField
                  required
                  fullWidth
                  label="Username"
                  name="username"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="start"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div className="mb-3">
                <TextField
                  required
                  select
                  fullWidth
                  label="Select Role"
                  onChange={(e) =>
                    setUserData({ ...userData, role: e.target.value })
                  }
                >
                  {Object.entries(roles).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="mb-3">
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  loading={loading}
                >
                  Create a user
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Users;
