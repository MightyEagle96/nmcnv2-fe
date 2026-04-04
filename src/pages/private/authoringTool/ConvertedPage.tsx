import { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import parser from "html-react-parser";
//import { no_correct_answer, optionsTags } from "./optionsTag";
import { Badge } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { Chat, Logout, RepeatRounded, Upload } from "@mui/icons-material";
import { Alert } from "@mui/material";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { httpService } from "../../../httpService";
import { toastError } from "../../../components/ErrorToast";
import type { IProgrammeData } from "../../../types/IProgramme";

type IResponse = {
  questionId: string;
  startGroup: boolean;
  endGroup: boolean;
  clustered: boolean;
  question: string;
  options: string[];
  correctAnswer: string;
  error: string;
};

export default function ConvertedPage() {
  const [response, setResponse] = useState<IResponse[]>([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [programmeToUpload, setProgrammeToUpload] =
    useState<IProgrammeData | null>(null);
  const [show, setShow] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [stemsWithoutQuestions, setStemsWithoutQuestions] = useState(0);
  const [totalOptions, setTotalOptions] = useState(0);
  const [questionsWithoutOptions, setQuestionsWithoutOptions] = useState(0);
  const [questionsWithNoCorrectAnswer, setQuestionsWithNoCorrectAnswer] =
    useState(0);
  const [stemsWithoutQuestionsIds, setStemsWithoutQuestionsIds] = useState([]);
  const [currentStemIndex, setCurrentStemIndex] = useState(0);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);

    const hash = window.location.hash;

    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        navigate({
          pathname: "/authoring/result",
          hash: `#${id}`,
        });
      }
    }
  };

  const navigate = useNavigate();

  const no_correct_answer = "No correct answer found";

  //const dispatch = useDispatch();
  const getData = async () => {
    setLoading(true);
    try {
      const { data } = await httpService("authoring/result");
      if (data) {
        // console.log(data);

        setStemsWithoutQuestions(
          data.reduce((acc: any, val: IResponse) => {
            if (!val.question) acc++;
            return acc;
          }, 0),
        );

        setStemsWithoutQuestionsIds(
          data.reduce((acc: any, val: IResponse) => {
            if (!val.question) acc.push(val.questionId);
            return acc;
          }, []),
        );

        setTotalOptions(
          data.reduce((acc: any, val: IResponse) => {
            acc += val.options.length;
            return acc;
          }, 0),
        );

        setQuestionsWithoutOptions(
          data.reduce((acc: any, val: IResponse) => {
            if (val.options.length === 0) acc++;
            return acc;
          }, 0),
        );

        setQuestionsWithNoCorrectAnswer(
          data.reduce((acc: any, val: IResponse) => {
            if (!val.correctAnswer) acc++;
            return acc;
          }, 0),
        );

        setResponse(data);
      }
    } catch (error) {
      toastError(error);
    }
    setLoading(false);
  };

  const getProgrammes = async () => {
    setLoading(true);
    const { data, error } = await httpService("programme/view");
    if (data) {
      console.log(data);
      setSubjects(data.programmes);
    }
    if (error) {
      alert(error);
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
            { programme: programmeToUpload?._id, questions: response },
          );

          if (data) {
            Swal.fire({ icon: "success", title: data }).then(async () => {
              const { data } = await httpService("authoring/deletefiles");
              if (data) {
                Swal.fire({ icon: "success", title: data }).then(() =>
                  navigate("/authoring"),
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

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");

      setTimeout(() => {
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          element.classList.add("highlight-question");

          setTimeout(() => {
            element.classList.remove("highlight-question");
          }, 2000);
        }
      }, 100);
    }
  }, [location]);

  const makeOptionCorrectAnswer = async (questionIndex, correctAnswer) => {
    Swal.fire({
      icon: "question",
      title: "Make this option the correct answer?",
      text: "This cannot be undone. To undo this, you will have to upload the form file, all over again",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data } = await httpService.patch("updatecorrectanswer", {
          questionIndex,
          correctAnswer,
        });

        Swal.fire({ icon: "success", title: data }).then(() => getData());
      }
    });
  };

  return (
    <div>
      <div style={{ maxHeight: "100vh", overflowY: "scroll" }}>
        <div className="container mt-5">
          <div className="mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <div className="alert alert-primary col-lg-4">
                <Typography variant="h5" fontWeight={700}>
                  Conversion Result
                </Typography>
              </div>
              <div>
                <Stack direction={"row"} spacing={2}>
                  <LoadingButton
                    endIcon={<Chat />}
                    color="success"
                    onClick={() => navigate("/authoring/simulation")}
                  >
                    simulate examination
                  </LoadingButton>

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
          {response.map((c, questionIndex) => (
            <div id={c.questionId} key={questionIndex} className="mb-4 mt-3">
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
                      <Typography>{String.fromCharCode(65 + i)}.</Typography>
                    </div>
                    <div>{parser(option)}</div>
                    {c.correctAnswer === option && (
                      <div>
                        <Badge bg="success">correct answer</Badge>
                      </div>
                    )}
                    {c.error && c.error === no_correct_answer && (
                      <div>
                        <LoadingButton
                          onClick={() => {
                            makeOptionCorrectAnswer(questionIndex, option);
                          }}
                        >
                          Make this option the correct answer
                        </LoadingButton>
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
          <div className="mt-2">
            {response.length > 0 && (
              <div className=" ">
                <div className="row">
                  <div className="col-lg-6">
                    <LoadingButton
                      color="error"
                      variant="contained"
                      onClick={getProgrammes}
                      loading={loading}
                    >
                      GET subjects
                    </LoadingButton>
                    {subjects.length > 0 && (
                      <div className="mt-4">
                        <TextField
                          fullWidth
                          label="Select subject"
                          select
                          onChange={(e) => setProgrammeToUpload(e.target.value)}
                        >
                          {subjects.map((c) => (
                            <MenuItem value={c}>
                              <Typography textTransform={"uppercase"}>
                                {`${c.name} - ${c.code}`}
                              </Typography>
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-6">
                    {programmeToUpload && (
                      <div>
                        <Typography variant="caption" gutterBottom>
                          You are uploading the questions under this program
                        </Typography>
                        <Typography
                          variant="h5"
                          textTransform={"uppercase"}
                          fontWeight={700}
                        >
                          {programmeToUpload.name}
                        </Typography>
                        <Typography
                          fontWeight={300}
                          color={"GrayText"}
                          textTransform={"uppercase"}
                        >
                          {programmeToUpload.code}
                        </Typography>
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
          <Modal show={show} onHide={handleClose} centered size="lg">
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
                      {totalOptions}
                    </Typography>
                  </div>
                </div>
                <div
                  className="col-lg-4 text-center mb-4"
                  style={{ color: "#0e3854" }}
                >
                  <Typography>Questions without options</Typography>
                  <Typography variant="h2" fontWeight={700}>
                    {questionsWithoutOptions}
                  </Typography>
                </div>
                <div
                  className="col-lg-4 text-center mb-4"
                  style={{ color: "#0e3854" }}
                >
                  <Typography>Questions without answer</Typography>
                  <Typography variant="h2" fontWeight={700}>
                    {questionsWithNoCorrectAnswer}
                  </Typography>
                </div>

                <div
                  className="col-lg-4 text-center mb-4"
                  style={{
                    color: "#0e3854",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => {
                    if (!stemsWithoutQuestionsIds.length) return;

                    const nextIndex =
                      currentStemIndex >= stemsWithoutQuestionsIds.length - 1
                        ? 0 // loop back to start
                        : currentStemIndex + 1;

                    setCurrentStemIndex(nextIndex);

                    navigate({
                      pathname: "/authoring/result",
                      hash: `#${stemsWithoutQuestionsIds[nextIndex]}`,
                    });
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <Typography>Stems without question</Typography>
                  <Typography variant="h2" fontWeight={700}>
                    {stemsWithoutQuestions}
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
                  questionsWithNoCorrectAnswer > 0 ||
                  questionsWithoutOptions > 0 ||
                  stemsWithoutQuestions > 0
                }
              >
                Upload questions
              </LoadingButton>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}
