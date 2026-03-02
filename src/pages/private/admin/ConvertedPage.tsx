import { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { httpService } from "../../../httpService";
import parser from "html-react-parser";
import { Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Logout, Upload } from "@mui/icons-material";
import { Alert } from "@mui/material";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { toastError } from "../../../components/ErrorToast";

type QuestionData = {
  questionId: string;
  question: string;
  startGroup: boolean;
  clustered: boolean;
  options: string[];
  correctAnswer: string;
  error: string;
  endGroup: boolean;
};

type IProgramme = {
  _id: string;
  name: string;
  code: string;
  viva: number;
  procedure: number;
  research: number;
  clientCare: number;
  expectantFamilyCare: number;
};
export default function ConvertedPage() {
  const [response, setResponse] = useState([]);
  const [programmes, setProgrammes] = useState<IProgramme[]>([]);
  const [loading, setLoading] = useState(false);
  const [programmeToUpload, setProgrammeToUpload] = useState<string>("");
  const [show, setShow] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [questionInfo, setQuestionInfo] = useState({
    stemWithoutQuestions: 0,
    stemsWithoutCorrectAnswers: 0,
    stemsWithoutOptions: 0,
    totalOptions: 0,
  });

  //const [stemsWithoutQuestions, setStemsWithoutQuestions] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await httpService("authoring/result");
      if (data) {
        console.log(data);

        setResponse(data.response);
        setQuestionInfo({ ...data, response: null });
      }
    } catch (error) {
      toastError(error);
    }
    setLoading(false);
  };

  const getProgrammes = async () => {
    setLoading(true);
    try {
      const { data } = await httpService("programme/view");
      if (data) {
        console.log(data);
        setProgrammes(data.programmes);
      }
    } catch (error) {
      toastError(error);
    }
    setLoading(false);
  };

  const uploadQuestions = async () => {
    Swal.fire({
      icon: "question",
      title: "Upload Question?",
      text: "When uploaded to the question bank it can't be modified again",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setUploading(true);
        try {
          const { data } = await httpService.post(
            "questionbank/uploadquestions",
            { programme: programmeToUpload, questions: response },
          );

          if (data) {
            Swal.fire({ icon: "success", title: data }).then(async () => {
              const { data } = await httpService("authoring/deletefiles");
              if (data) {
                Swal.fire({ icon: "success", title: data }).then(() =>
                  navigate("/authoringtool"),
                );
              }
            });
          }
        } catch (error) {
          toastError(error);
        }
        setUploading(false);
      }
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className=" mt-5 mb-5">
        <div className="mb-2">
          <div className="d-flex justify-content-between align-items-center">
            <div className="alert alert-primary col-lg-4">
              <Typography variant="h5" fontWeight={700}>
                Conversion Result
              </Typography>
            </div>
            <div>
              <Stack direction={"row"} spacing={2}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => navigate("/authoring")}
                  endIcon={<Logout />}
                >
                  Exit
                </Button>
              </Stack>
            </div>
          </div>
        </div>
        {loading && <CircularProgress />}
        <div style={{ height: "100vh", overflow: "scroll" }}>
          {response.map((c: QuestionData, questionIndex) => (
            <div key={questionIndex} className="mb-4 mt-3">
              <div className="d-flex justify-content-end">
                <div className="me-1">
                  {c.startGroup && <Badge>START GROUP</Badge>}
                </div>
                <div className="me-1">
                  {c.endGroup && <Badge bg="danger">END GROUP</Badge>}
                </div>
                <div>
                  {c.clustered ? (
                    <Badge bg="warning">CLUSTERED QUESTION</Badge>
                  ) : (
                    <Badge bg="secondary">UNCLUSTERED QUESTION</Badge>
                  )}
                </div>
              </div>
              <Typography gutterBottom fontWeight={700}>
                Question {questionIndex + 1}
              </Typography>
              <div style={{ fontSize: 18 }}>
                {c.question ? (
                  <>{parser(c.question)}</>
                ) : (
                  <div className="col-lg-4">
                    <Alert severity="error">
                      No question found on this stem.
                    </Alert>
                  </div>
                )}
              </div>

              <div className="mt-1">
                {c.options.length === 0 && (
                  <div className="col-lg-4">
                    <Alert variant="filled" severity="warning">
                      This question does not have options
                    </Alert>
                  </div>
                )}
                {c.options.map((option, i) => (
                  <Stack key={i} direction={"row"} spacing={2}>
                    <div>
                      <Typography>
                        <b>{String.fromCharCode(97 + i)}</b>
                      </Typography>
                    </div>
                    <div>{parser(option)}</div>
                    {c.correctAnswer === option && (
                      <div>
                        <Badge bg="success">correct answer</Badge>
                      </div>
                    )}
                  </Stack>
                ))}
              </div>
              <div className="mt-2">
                {c.options.length > 4 && (
                  <Alert variant="filled" severity="warning">
                    Options more than 4
                  </Alert>
                )}
                {c.options.length < 4 && (
                  <Alert variant="filled" severity="warning">
                    Options less than 4
                  </Alert>
                )}
              </div>
              {c.error && (
                <div className="mt-1">
                  <div className="col-lg-4">
                    {/* <div className="alert alert-danger">{c.error}</div> */}
                    <Alert variant="filled" severity="error">
                      {c.error}
                    </Alert>
                  </div>
                </div>
              )}
              <hr />
            </div>
          ))}
        </div>
        <div className="mt-2">
          {response.length > 0 && (
            <div className=" ">
              <div className="row">
                <div className="col-lg-4">
                  <LoadingButton
                    color="error"
                    variant="contained"
                    onClick={getProgrammes}
                    loading={loading}
                  >
                    GET programmes
                  </LoadingButton>
                  {programmes.length > 0 && (
                    <div className="mt-4">
                      <TextField
                        fullWidth
                        label="Select programme"
                        select
                        onChange={(e) => setProgrammeToUpload(e.target.value)}
                      >
                        {programmes.map((c) => (
                          <MenuItem value={c._id}>
                            <Typography textTransform={"uppercase"}>
                              {`${c?.name} - ${c.code}`}
                            </Typography>
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  )}
                </div>
                <div className="col-lg-4">
                  {programmeToUpload && (
                    <div>
                      <LoadingButton
                        startIcon={<Upload />}
                        onClick={handleShow}
                      >
                        preview upload
                      </LoadingButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>UPLOAD QUESTIONS TO SERVER</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div
                className="col-lg-4 text-center mb-4"
                style={{ color: "#0e3854" }}
              >
                <Typography>Total Questions</Typography>
                <Typography variant="h2" fontWeight={700}>
                  {response.length}
                </Typography>
              </div>
              <div
                className="col-lg-4 text-center mb-4 "
                style={{ color: "#0e3854" }}
              >
                <div>
                  <Typography>Total Options</Typography>
                  <Typography variant="h2" fontWeight={700}>
                    {questionInfo.totalOptions}
                  </Typography>
                </div>
              </div>
              <div
                className="col-lg-4 text-center mb-4"
                style={{ color: "#0e3854" }}
              >
                <Typography>Questions without options</Typography>
                <Typography variant="h2" fontWeight={700}>
                  {questionInfo.stemsWithoutOptions}
                </Typography>
              </div>
              <div
                className="col-lg-4 text-center mb-4"
                style={{ color: "#0e3854" }}
              >
                <Typography>Questions without answer</Typography>
                <Typography variant="h2" fontWeight={700}>
                  {questionInfo.stemsWithoutOptions}
                </Typography>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <LoadingButton
              onClick={uploadQuestions}
              loading={uploading}
              loadingPosition="end"
              endIcon={<Upload />}
              variant="contained"
              disabled={
                questionInfo.stemsWithoutOptions > 0 ||
                questionInfo.stemsWithoutCorrectAnswers > 0
              }
            >
              Upload questions
            </LoadingButton>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
