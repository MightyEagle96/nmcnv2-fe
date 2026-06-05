import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { httpService } from "../../../httpService";
import { useRefresh } from "../../../context/RefreshContext";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { Badge, Modal, Table } from "react-bootstrap";
import { People, Replay } from "@mui/icons-material";
import { toastError } from "../../../components/ErrorToast";

type IExamination = {
  name: string;
  type: string;
  duration: number;
};

function ExamSessions() {
  const [examination, setExamination] = useState<IExamination | null>(null);
  const [examCentres, setExamCentres] = useState<any>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionSummary, setSessionSummary] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [centreSummary, setCentreSummary] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [fetchingSummary, setFetchingSummary] = useState(false);
  const [session, setSession] = useState("");

  const [params] = useSearchParams();

  const id = params.get("examination");

  const { refresh, setRefresh } = useRefresh();

  const getData = async () => {
    setFetching(true);
    const [
      examinationData,
      examCentreData,
      examSessionData,
      candidateSessionData,
    ] = await Promise.all([
      httpService(`/examination/view/${id}`),
      httpService(`/examination/viewexamcentres/${id}`),
      httpService(`/examination/examsessions/${id}`),
      httpService(`/examination/candidatespersession/${id}`),
    ]);

    if (examinationData) {
      const { data } = examinationData;
      if (data) {
        setExamination(data);
      }
    }

    if (examCentreData) {
      const { data } = examCentreData;

      if (data) {
        console.log(data);
        setExamCentres(data);
      }
    }

    if (examSessionData) {
      const { data } = examSessionData;

      if (data) {
        console.log(data);
        setSessions(data);
      }
    }

    if (candidateSessionData) {
      const { data } = candidateSessionData;
      if (data) {
        setSessionSummary(data);
      }
    }
    setFetching(false);
    setLoading(false);
  };

  const generateSessions = async () => {
    setLoading(true);
    const response = await httpService(`/examination/generatesessions/${id}`);

    try {
      if (response.data) {
        getData();
        toast.success(response.data);
      }
    } catch (error) {
      toastError(error);
    }

    setLoading(false);
  };
  // const assignCandidatesToSession = async () => {
  //   setLoading(true);
  //   const { data } = await httpService(`/examination/assigncandidates/${id}`);

  //   if (data) {
  //     getData();
  //     toast.success(data);
  //   }
  //   setLoading(false);
  // };

  const synchronizeData = async () => {
    setLoading(true);
    const { data } = await httpService(`/examination/synchronizedata`, {
      params: { id },
    });
    if (data) {
      getData();
      toast.success(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData();
    //getCentreResponseSummary();
  }, [refresh]);

  const generateData = async () => {
    setLoading(true);
    const { data } = await httpService(
      `/examination/generateexamcentres/${id}`,
    );

    if (data) {
      setRefresh(!refresh);
      toast.success(data);
    }

    setLoading(false);
  };

  const getCentreResponseSummary = async (e: any) => {
    e.preventDefault();
    //console.log("hello");
    setFetchingSummary(true);
    const { data } = await httpService("results/centreresponsesummary", {
      params: { examination: id, session },
    });
    if (data) {
      setShow(!show);
      setCentreSummary(data);
    }
    setFetchingSummary(false);
  };
  return (
    <div>
      {fetching && (
        <div className="text-center">
          <CircularProgress size={20} />
        </div>
      )}
      {examination && (
        <div>
          <div className="mb-4">
            <Typography variant="caption">Examination Sessions</Typography>
            <Typography
              variant="h5"
              textTransform={"uppercase"}
              fontWeight={700}
            >
              {examination.name}
            </Typography>
            <div>
              <LoadingButton
                onClick={generateData}
                color="error"
                loading={loading}
                variant="contained"
              >
                generate exam centres
              </LoadingButton>
            </div>
          </div>
          {examCentres.length === 0 ? (
            <div className="col-lg-6">
              <Alert severity="error">No exam centres generated</Alert>
            </div>
          ) : (
            <div className="row">
              <div
                className="col-lg-6 border rounded p-3 m-2 overflow-scroll"
                style={{ maxHeight: "60vh" }}
              >
                <div className="mb-3">
                  <Typography color={"GrayText"} variant="h6">
                    Examination Centres
                  </Typography>
                </div>
                <Table striped borderless>
                  <thead>
                    <tr>
                      <th>S.N</th>
                      <th>Centre</th>
                      <th>State</th>
                      <th>Candidates</th>
                      <th>Sessions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examCentres.map((c: any, i: number) => (
                      <tr key={i}>
                        <td>
                          <Typography variant="body2">{i + 1}</Typography>
                        </td>
                        <td>
                          <Typography
                            variant="body2"
                            textTransform={"capitalize"}
                          >
                            {c.centre?.centreId}
                          </Typography>
                        </td>
                        <td>
                          <Typography
                            variant="body2"
                            textTransform={"uppercase"}
                          >
                            {c.centre?.state}
                          </Typography>
                        </td>
                        <td>
                          <Typography
                            variant="body2"
                            textTransform={"uppercase"}
                          >
                            {c.totalCandidates.toLocaleString()}
                          </Typography>
                        </td>
                        <td>
                          <Typography
                            variant="body2"
                            textTransform={"uppercase"}
                          >
                            {c.sessions.length}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="col-lg-5 border rounded p-3 m-2">
                <div className="mb-3">
                  <Typography color={"GrayText"} variant="h6">
                    Examination Sessions
                  </Typography>
                </div>
                <LoadingButton
                  loading={loading}
                  startIcon={<Replay />}
                  onClick={generateSessions}
                  loadingPosition="start"
                >
                  <Typography variant="caption"> generate sessions</Typography>
                </LoadingButton>

                <LoadingButton
                  loading={loading}
                  startIcon={<People />}
                  onClick={synchronizeData}
                  loadingPosition="start"
                  color="success"
                >
                  <Typography variant="caption"> synchronize data</Typography>
                </LoadingButton>
                <Table striped borderless>
                  <thead>
                    <tr>
                      <th>S.N</th>
                      <th>Name</th>
                      <th>Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions
                      .sort((a, b) =>
                        a.sessionNumber < b.sessionNumber ? -1 : 1,
                      )
                      .map((c, i) => (
                        <tr key={i}>
                          <td>
                            <Typography variant="body2">{i + 1}</Typography>
                          </td>

                          <td>
                            <Typography
                              variant="body2"
                              textTransform={"capitalize"}
                            >
                              {c.sessionName}{" "}
                              {c.status && <Badge>{c.status}</Badge>}
                            </Typography>
                          </td>
                          <td>
                            <Typography
                              variant="body2"
                              textTransform={"uppercase"}
                            >
                              {c.sessionCode}
                            </Typography>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </div>
              <div className="col-lg-5 border rounded p-3 m-2">
                <div className="mb-3">
                  <Typography color={"GrayText"} variant="h6">
                    Session Candidates Summary{" "}
                    <IconButton onClick={getData}>
                      <Replay color="success" />
                    </IconButton>
                  </Typography>
                </div>
                <div>
                  <Table striped borderless>
                    <thead>
                      <tr>
                        <th>S.N</th>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Candidates</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessionSummary.map((c, i) => (
                        <tr key={i}>
                          <td>
                            <Typography variant="body2">{i + 1}</Typography>
                          </td>
                          <td>
                            <Typography variant="body2">
                              {c.sessionName}
                            </Typography>{" "}
                          </td>
                          <td>
                            <Typography variant="body2">
                              {c.sessionCode}
                            </Typography>{" "}
                          </td>
                          <td>
                            <Typography variant="body2">
                              {c.candidateCount.toLocaleString()}
                            </Typography>{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>

              <div className="col-lg-5 border rounded p-3 m-2">
                <form onSubmit={getCentreResponseSummary}>
                  <TextField
                    fullWidth
                    label="Examination Sessions"
                    select
                    required
                    onChange={(e) => setSession(e.target.value)}
                  >
                    {sessions.map((c, i) => (
                      <MenuItem key={i} value={c._id}>
                        {c.sessionName}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Button
                    type="submit"
                    //onClick={getCentreResponseSummary}
                    loading={fetchingSummary}
                  >
                    View Results distribution
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal
        show={show}
        onHide={() => {
          setShow(false);
          setCentreSummary([]);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Typography variant="h6">Results distribution</Typography>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ overflowY: "scroll", maxHeight: "60vh" }}>
            <Table striped borderless>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Centre ID</th>
                  <th>Candidates</th>
                  <th>Results</th>
                </tr>
              </thead>
              <tbody>
                {centreSummary.map((c, i) => (
                  <tr
                    key={i}
                    className={c.totalResponses === 0 ? "table-danger" : ""}
                  >
                    <td>{i + 1}.</td>
                    <td>{c.centre.centreId}</td>
                    <td>{c.totalCandidates}</td>
                    <td>{c.totalResponses}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ExamSessions;
