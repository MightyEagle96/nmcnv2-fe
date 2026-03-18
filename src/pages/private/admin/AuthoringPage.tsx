import { useState } from "react";
import { toastError } from "../../../components/ErrorToast";
import { httpService } from "../../../httpService";
import { Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const AuthoringPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    const formData = new FormData();
    try {
      setLoading(true);
      //console.log(file.name);
      formData.append("testform", file, file.name);

      const { data } = await httpService.post(
        // "/authoring/receivefile",
        "/authoring/parsedocx",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      if (data) {
        console.log(data);
        //navigate(`/authoringtool/result`);
        // window.location.assign("/authoring/result");
      }

      setLoading(false);
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="mb-5">
        <h1>Authoring Page</h1>
      </div>
      <div className="col-lg-5">
        <div>
          <label htmlFor="testform" className="form-label">
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
  );
};

export default AuthoringPage;
