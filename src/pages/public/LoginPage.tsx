import logo from "../../assets/logo.png";
import { Button, TextField, Typography } from "@mui/material";
import { Login } from "@mui/icons-material";
import React, { useState } from "react";
import { httpService } from "../../httpService";
import { toast } from "react-toastify";

import type { AxiosError } from "axios";
const LoginPage = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await httpService.post("account/login", user);
      if (data) {
        window.location.href = "/";
      }
    } catch (err) {
      const error = err as AxiosError;

      if (error.response?.data) {
        toast.error(error.response?.data as string);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{ maxHeight: "80vh" }}
      className="d-flex justify-content-center"
    >
      <div className="col-lg-4 shadow-sm rounded p-4 my-5">
        <div className="text-center mb-4">
          <img src={logo} height={100} className="mb-4" />
          <Typography variant="h4" fontWeight={700}>
            NMCN ADMIN LOGIN
          </Typography>
        </div>
        <form onSubmit={loginUser}>
          <div className="mb-3">
            <TextField
              fullWidth
              label="Username"
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <TextField
              fullWidth
              type="password"
              label="Password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>
          <div className="my-5">
            <Button
              fullWidth
              variant="contained"
              type="submit"
              endIcon={<Login />}
              loading={loading}
              loadingPosition="end"
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
