import { useEffect, useState } from "react";
import { httpService } from "../../../httpService";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Typography,
  Chip,
  TextField,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Swal from "sweetalert2";
import { AccessTime, Clear, Done, Visibility } from "@mui/icons-material";
import { blue, green, red } from "@mui/material/colors";
import { Table, Modal, Badge } from "react-bootstrap";
import format from "format-duration";
import { toast } from "react-toastify";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { useRefresh } from "../../../context/RefreshContext";
import { toastError } from "../../../components/ErrorToast";

function ExaminationSchedule() {
  const [params] = useSearchParams();

  const examinationId = params.get("examination");
  const [examination, setExamination] = useState(null);

  const [duration, setDuration] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { refresh, setRefresh } = useRefresh();

  const [updatingDuration, setUpdatingDuration] = useState(false);
  const [updatingDownloadTime, setUpdatingDownloadTime] = useState(false);
  const [updatingExamTime, setUpdatingExamTime] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadAt, setDownloadAt] = useState(null);
  const [examBeginAt, setExamBeginAt] = useState(null);

  const getData = async () => {
    const { data } = await httpService(`/cbt/viewsingle?_id=${examinationId}`);

    if (data) {
      setExamination(data);
    }
  };

  useEffect(() => {
    getData();
  }, [refresh]);

  //update the download time
  const updateDownloadTime = async () => {
    if (!downloadAt) return toast.error("No download time set");

    setUpdatingDownloadTime(true);
    try {
      const { data } = await httpService.patch(
        "examination/updatedownloadtime",
        {
          examination: examinationId,
          time: downloadAt.toISOString(),
        },
      );

      if (data) {
        toast.success(data);
        setRefresh(!refresh);
      }
    } catch (error) {
      toastError(error);
    }
    setUpdatingDownloadTime(false);
  };

  //update the exam time
  const updateExamTime = async () => {
    if (!examBeginAt) return toast.error("No exam time set ");

    try {
      setUpdatingExamTime(true);
      const { data } = await httpService.patch("examination/updateexamtime", {
        examination: examinationId,
        time: examBeginAt.toISOString(),
      });

      if (data) {
        toast.success(data);
        setRefresh(!refresh);
      }

      setUpdatingExamTime(false);
    } catch (error) {
      toastError(error);
    }
  };

  const updateDuration = async () => {
    setUpdatingDuration(true);

    try {
      const examDuration =
        (duration.hours * 3600 + duration.minutes * 60 + duration.seconds) *
        1000;

      const { data } = await httpService.patch("examination/updateduration", {
        examDuration,
        examination: examinationId,
      });

      if (data) {
        toast.success(data);
        setRefresh(!refresh);
      }
    } catch (error) {
      toastError(error);
    }

    setUpdatingDuration(false);
  };

  const completePapers =
    examination &&
    examination.programmes.length === examination.questionBanks.length
      ? true
      : false;

  const downloadTime = examination && examination.downloadTime ? true : false;

  const examTime = examination && examination.scheduledTime ? true : false;

  const durationSet = examination && examination.duration > 0 ? true : false;

  const concludePaper = () => {
    Swal.fire({
      icon: "question",
      title: "Conclude Paper",
      text: "This will end this paper",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data, error } = await httpService
          .get
          // `cbt/concludepaper/${paperType}`
          ();

        if (data) {
          toast.success(data);
          setRefresh(!refresh);
        }
        if (error) {
          toast.error(error);
        }
      }
    });
  };

  const activateExam = () => {
    Swal.fire({
      icon: "question",
      text: "Activate Paper",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { data, error } = await httpService.patch(
          "examination/toggleactive",
          {
            examination: id,
            active: !examination.active,
          },
        );
        //`cbt/activatepaper/${paperType}`

        if (data) {
          setRefresh(!refresh);
          toast.success(data);
        }

        if (error) {
          toast.error(error);
        }
        setLoading(false);
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDuration((prev) => ({
      ...prev,
      [name]: Math.max(0, Number(value)), // prevent negative numbers
    }));
  };

  return (
    <div>
      {examination && (
        <div>
          <div className="col-lg-6 p-3 bg-light">
            <small>Examination</small>
            <p style={{ fontWeight: 700, textTransform: "capitalize" }}>
              {examination.name}
            </p>
          </div>
          <div className="row">
            <div
              style={{ maxHeight: "50vh", overflowY: "scroll" }}
              className="col-lg-6  mb-3 me-3 border p-3 rounded"
            >
              <div className="mb-2">
                <Typography fontWeight={900} color={blue[900]}>
                  QUESTION BANKS
                </Typography>
                <hr />
              </div>
              <Chip
                color="error"
                label={`${examination.questionBanks.length} of ${examination.programmes.length} banks added`}
              />
              <Table striped borderless>
                <thead>
                  <tr>
                    <th>S.N</th>
                    <th>Programme</th>
                    <th>Set Bank</th>
                  </tr>
                </thead>
                <tbody>
                  {examination.programmes.map((c, i) => (
                    <tr key={i}>
                      <td>
                        <Typography variant="overline">{i + 1}.</Typography>
                      </td>
                      <td>
                        <Typography
                          variant="body2"
                          textTransform={"capitalize"}
                          fontWeight={700}
                        >
                          {c.name}
                        </Typography>

                        <Typography variant="overline">{c.code}</Typography>
                      </td>
                      <td>
                        <GetQuestionBank
                          programme={c}
                          getSchedule={getData}
                          examination={examinationId}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="col-lg-5 mb-3  border p-3 rounded">
              <div className="mb-4">
                <Typography fontWeight={900} color={blue[900]}>
                  Download and Examination Time Schedule
                </Typography>
                <hr />
              </div>
              <div className="mt-3">
                <div className="d-flex align-items-center">
                  <DateTimePicker
                    label="Scheduled Download Time"
                    sx={{ width: "80%" }}
                    value={downloadAt}
                    onChange={setDownloadAt}
                    minDate={dayjs()}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                  <LoadingButton
                    className="ms-3"
                    loading={updatingDownloadTime}
                    onClick={updateDownloadTime}
                  >
                    update
                  </LoadingButton>
                </div>
                <div className=" mt-2">
                  {examination.downloadTime && (
                    <Typography variant="caption">
                      {new Date(examination.downloadTime).toLocaleString()}
                    </Typography>
                  )}
                </div>
              </div>
              <div className="mt-5">
                <div className="d-flex align-items-center">
                  <DateTimePicker
                    label="Scheduled Examination Time"
                    sx={{ width: "80%" }}
                    value={examBeginAt}
                    onChange={setExamBeginAt}
                    minDate={dayjs()}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                  <LoadingButton
                    className="ms-3"
                    loading={updatingDownloadTime}
                    onClick={updateExamTime}
                  >
                    update
                  </LoadingButton>
                </div>
                <div className=" mt-2">
                  {examination.scheduledTime && (
                    <Typography variant="caption">
                      {new Date(examination.scheduledTime).toLocaleString()}
                    </Typography>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-3 me-3 border p-3 rounded">
              <div className="mb-2">
                <Typography fontWeight={900} color={blue[900]}>
                  EXAMINATION DURATION
                </Typography>
                <hr />
              </div>

              <Box display="flex" gap={2}>
                <TextField
                  type="number"
                  label="Hours"
                  name="hours"
                  value={duration.hours}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  fullWidth
                />
                <TextField
                  type="number"
                  label="Minutes"
                  name="minutes"
                  fullWidth
                  value={duration.minutes}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 59 }}
                />
                <TextField
                  type="number"
                  label="Seconds"
                  name="seconds"
                  fullWidth
                  value={duration.seconds}
                  onChange={handleChange}
                  inputProps={{ min: 0, max: 59 }}
                />
              </Box>

              <div
                className="mt-3 mb-3 p-3 rounded-3"
                style={{ backgroundColor: "#1d2b67", color: "white" }}
              >
                <Typography variant="overline">DURATION</Typography>
                <Typography variant="h6">
                  {format(examination.duration)}
                </Typography>
              </div>
              <LoadingButton
                onClick={updateDuration}
                loading={updatingDuration}
                startIcon={<AccessTime />}
              >
                update duration
              </LoadingButton>
            </div>
            <div className="col-lg-5 mb-3  border p-3 rounded">
              <div className="mb-2">
                <Typography fontWeight={900} color={blue[900]}>
                  PREDEPLOYMENT CHECKLIST {"  "}{" "}
                  {examination.active && <Badge bg="success">ACTIVATED</Badge>}
                </Typography>
                <hr />
              </div>
              <div>
                <Table striped borderless>
                  <thead>
                    <tr>
                      <th>
                        <p>Item</p>
                      </th>
                      <th>
                        <p>Status</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <p>All question banks populated</p>
                      </td>
                      <td>
                        {completePapers ? (
                          <Done sx={{ color: green[500] }} />
                        ) : (
                          <Clear sx={{ color: red[500] }} />
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>Examination time set</p>
                      </td>
                      <td>
                        {examTime ? (
                          <Done sx={{ color: green[500] }} />
                        ) : (
                          <Clear sx={{ color: red[500] }} />
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>Download time set</p>
                      </td>
                      <td>
                        {downloadTime ? (
                          <Done sx={{ color: green[500] }} />
                        ) : (
                          <Clear sx={{ color: red[500] }} />
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <p>Paper duration set</p>
                      </td>
                      <td>
                        {durationSet ? (
                          <Done sx={{ color: green[500] }} />
                        ) : (
                          <Clear sx={{ color: red[500] }} />
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div>
                <LoadingButton
                  disabled={
                    !(
                      completePapers &&
                      downloadTime &&
                      examTime &&
                      durationSet
                    ) || examination.concluded
                  }
                  variant="contained"
                  loading={loading}
                  onClick={activateExam}
                >
                  {!examination.active ? "activate exam" : "deactivate exam"}
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExaminationSchedule;

function GetQuestionBank({ programme, getSchedule, examination }) {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [adding, setAdding] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [bankIndex, setBankIndex] = useState(0);
  const [questionBank, setQuestionBank] = useState("");

  const handleClose = () => {
    setShow(false);
    setSelectedBank("");
    setQuestionBanks([]);
  };
  const getData = async () => {
    setLoading(true);
    const { data } = await httpService(
      `questionbank/programme/${programme._id}`,
    );
    if (data) {
      setQuestionBanks(data.questionBanks);
      setShow(true);
    }

    setLoading(false);
  };

  const addSubjectToSchedule = () => {
    Swal.fire({
      icon: "question",
      title: "Add Bank to schedule",
      text: "Are you sure you want to add this question bank to the schedule for this programme?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setAdding(true);
          const { data } = await httpService.post(
            "examination/addquestionbanktoexam",
            {
              examination,
              programme: programme._id,
              questionBank: selectedBank,
            },
          );

          if (data) {
            viewQuestionBankStatus();
            getSchedule();
            setBankIndex(0);
            setSelectedBank([]);
            setShow(false);
            toast.success(data);
          }
        } catch (error) {
          toastError(error);
        }
        setAdding(false);
      }
    });
  };

  const viewQuestionBankStatus = async () => {
    const { data } = await httpService.get(
      `examination/questionbankstatus?examination=${examination}&programme=${programme._id}`,
    );
    if (data) {
      setQuestionBank(data.questionBanks[0].questionBank);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    viewQuestionBankStatus();
  }, []);
  return (
    <>
      {questionBank ? (
        <>
          <LoadingButton loading={loading} onClick={getData}>
            <Typography variant="overline" color="green">
              Bank Added
            </Typography>
          </LoadingButton>
          <IconButton href={`/questionbanks/questions/${questionBank}`}>
            <Visibility color="success" />
          </IconButton>
        </>
      ) : (
        <>
          <LoadingButton loading={loading} onClick={getData}>
            <Typography variant="overline">Add Bank</Typography>
          </LoadingButton>
        </>
      )}

      <Modal size="lg" onHide={handleClose} show={show}>
        <Modal.Header closeButton>
          <Modal.Title style={{ textTransform: "uppercase" }}>
            {programme.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped borderless>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Questions</th>
                <th>Date Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {questionBanks.length === 0 && (
                <tr>
                  <td className="text-center" colSpan={12}>
                    NO QUESTION BANK FOUND
                  </td>
                </tr>
              )}
              {questionBanks.map((c, i) => (
                <tr>
                  <td>{i + 1}</td>
                  <td>{c.questions}</td>
                  <td>{new Date(c.dateCreated).toLocaleString()}</td>
                  <td>
                    <Button
                      onClick={() => {
                        setSelectedBank(c._id);
                        setBankIndex(i + 1);
                      }}
                    >
                      select
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          {bankIndex !== 0 && <p className="me-5">Bank {bankIndex} selected</p>}
          <LoadingButton
            onClick={addSubjectToSchedule}
            disabled={!selectedBank}
            variant="contained"
            loading={adding}
          >
            Add to schedule
          </LoadingButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}
