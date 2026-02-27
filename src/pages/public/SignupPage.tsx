import logo from "../../assets/logo.png";
import { Button, MenuItem, TextField, Typography } from "@mui/material";
import { Login } from "@mui/icons-material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { httpService } from "../../httpService";

import { toast } from "react-toastify";
import { toastError } from "../../components/ErrorToast";

export const accountRoles = {
  admin: "admin",
  editor: "editor",
  caosceAdmin: "caosce admin",
};

type User = {
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  role?: string;
};
const SignupPage = () => {
  const [user, setUser] = useState<User | null>({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const createAccount = (e: React.FormEvent) => {
    e.preventDefault();

    Swal.fire({
      icon: "question",
      title: "Create account",
      text: "Are you sure you want to create an account?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const { data } = await httpService.post("account/signup", user);
          if (data) {
            toast.success(data);

            setTimeout(() => {
              navigate("/");
            }, 3000);
          }
        } catch (err) {
          toastError(err);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const roles = [
    accountRoles.admin,
    accountRoles.editor,
    accountRoles.caosceAdmin,
  ];

  return (
    <div
      style={{ minHeight: "80vh" }}
      className="d-flex justify-content-center"
    >
      <div className="col-lg-4 shadow-sm rounded p-4 my-5">
        <div className="text-center mb-4">
          <img src={logo} height={100} className="mb-4" />
          <Typography variant="h4" fontWeight={700}>
            CREATE ACCOUNT
          </Typography>
        </div>
        <form onSubmit={createAccount}>
          <div className="mb-5">
            <div className="mb-3">
              <TextField
                required
                fullWidth
                label="First Name"
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <TextField
                required
                fullWidth
                label="Last Name"
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <TextField
                fullWidth
                required
                label="Username"
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </div>
          </div>
          <div className="mb-5">
            <div className="mb-3">
              <TextField
                className="text-capitalize"
                fullWidth
                required
                label="Role"
                select
                onChange={(e) => setUser({ ...user, role: e.target.value })}
              >
                {roles.map((c) => (
                  <MenuItem className="text-capitalize" value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="mb-3">
              <TextField
                required
                fullWidth
                label="Password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                type="password"
              />
            </div>
            <div className="mb-3">
              <TextField
                fullWidth
                required
                error={error}
                helperText={error ? "Passwords do not match" : ""}
                label="Confirm Password"
                onBlur={(e) => setError(e.target.value !== user?.password)}
                type="password"
                //onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              />
            </div>
          </div>
          <div className="my-5">
            <Button
              className="mb-4"
              fullWidth
              variant="contained"
              type="submit"
              disabled={error}
              endIcon={<Login />}
              loading={loading}
              loadingPosition="end"
            >
              create account
            </Button>
            <div className="text-center">
              <Typography
                color="GrayText"
                component={Link}
                to="/"
                sx={{ textDecoration: "none" }}
              >
                Already have an account? Login
              </Typography>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
