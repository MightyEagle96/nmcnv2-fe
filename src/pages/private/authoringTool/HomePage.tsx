import React, { useState } from "react";
import { Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAppUser } from "../../../context/AppUserContext";
import { httpService } from "../../../httpService";
import { toastError } from "../../../components/ErrorToast";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAppUser();

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    setLoading(true);
    //console.log(file.name);
    formData.append("testform", file, file.name);

    try {
      const { data } = await httpService.post(
        "/authoring/receivefile",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (data) {
        navigate(`/authoring/result`);
      }
    } catch (error) {
      toastError(error);
    }

    setLoading(false);
  };

  return (
    <div>
      {user ? (
        <div className="">
          <div className="mb-5">
            <Typography variant="h4" fontWeight={700}>
              AUTHORING TOOL
            </Typography>
          </div>
          <div className="col-lg-5">
            <div>
              <label for="testform" className="form-label">
                Select a word document
              </label>
              <input
                className="form-control"
                type="file"
                id="testform"
                name="testform"
                accept=".doc, .docx"
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
      ) : (
        <div>
          <div className="my-5">
            <div className="text-center mb-5">
              <Typography variant="h2" fontWeight={700}>
                AUTHORING TOOL
              </Typography>
            </div>
            <div className="d-flex justify-content-center">
              <div className="col-lg-5">
                <div>
                  <label for="testform" className="form-label">
                    Select a word document
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="testform"
                    name="testform"
                    accept=".doc, .docx"
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
          </div>
        </div>
      )}
    </div>
  );
}
