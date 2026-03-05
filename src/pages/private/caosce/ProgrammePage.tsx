import React, { useEffect, useState } from "react";
import { toastError } from "../../../components/ErrorToast";
import { httpService } from "../../../httpService";
import { useSearchParams } from "react-router-dom";
import { Button, Divider, TextField, Typography } from "@mui/material";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { AdUnits, PlusOne } from "@mui/icons-material";

function ProgrammePage() {
  const [params] = useSearchParams();
  const [programmeData, setProgrammeData] = useState(null);
  const [show, setShow] = useState(false);
  const [creating, setCreating] = useState(false);
  const [procedureData, setProcedureData] = useState({
    name: "",
    code: "",
  });

  const [codeError, setCodeError] = useState("");

  const [nameError, setNameError] = useState("");

  const _id = params.get("id");
  const viewProgramme = async () => {
    try {
      const { data } = await httpService("caosce/programme", {
        params: { _id },
      });
      if (data) {
        setProgrammeData(data);
        console.log(data);
      }
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    viewProgramme();
  }, []);

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
  return (
    <div>
      {programmeData && (
        <div>
          <div className="d-flex justify-content-between">
            <div>
              <Typography
                gutterBottom
                variant="h5"
                textTransform={"capitalize"}
              >
                {" "}
                {programmeData.name}
              </Typography>
            </div>
            <div>
              <Button onClick={() => setShow(!show)}>add new prodedure</Button>
            </div>
          </div>
          <div className="border rounded">
            <div className="p-3">
              <div className="row fw-bold">
                <div className="col-lg-3">
                  <Typography variant="body2">Procedures</Typography>
                </div>
                <div className="col-lg-3">
                  <Typography variant="body2">Items Count</Typography>
                </div>
                <div className="col-lg-3">
                  <Typography variant="body2">Activities Count</Typography>
                </div>
              </div>
            </div>
            <Divider />
            <div className="p-3">
              <div className="row fw-bold">
                <div className="col-lg-3">
                  <Typography variant="h4">
                    {programmeData.procedureCount}
                  </Typography>
                </div>
                <div className="col-lg-3">
                  <Typography variant="h4">
                    {programmeData.itemCount}
                  </Typography>
                </div>
                <div className="col-lg-3">
                  <Typography variant="h4">
                    {programmeData.activityCount}
                  </Typography>
                </div>
              </div>
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
