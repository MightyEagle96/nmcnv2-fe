import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import {
  Alert,
  AlertTitle,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import { toastError } from "../../../components/ErrorToast";
import { httpService } from "../../../httpService";
import { Modal, Table } from "react-bootstrap";
import { Visibility } from "@mui/icons-material";

export interface ICentreExamResponse {
  _id: string;
  cbtExamination: {
    _id: string;
    name: string;
  };
  centre: string;
  totalCandidates: number;
  sessions: ISession[];
  capacity: number;
  __v: number;
  createdAt: string;
  updatedAt: string;
  status: "online" | "offline";
  id: string;
}

export interface ISession {
  examSession: IExamSession;
  candidates: number;
  started: number;
  submitted: number;
  _id: string;
}

export interface IExamSession {
  _id: string;
  cbtExamination: string;
  sessionName: string;
  sessionCode: string;
  sessionNumber: number;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface ISessionCandidates {
  firstName: string;
  lastName: string;
  indexNumber: string;
}
function ServerCandidates() {
  const [params] = useSearchParams();
  const [result, setResult] = useState<ICentreExamResponse | null>(null);
  const [sessionCandidates, setSessionCandidates] = useState<
    ISessionCandidates[]
  >([]);
  const [examSession, setExamSession] = useState<IExamSession>(
    {} as IExamSession,
  );

  const query = {
    centreId: params.get("centreId"),
    centre: params.get("server"),
    examination: params.get("exam"),
  };

  const getData = async () => {
    try {
      const { data } = await httpService.get("/server/servercandidatescounts", {
        params: {
          centre: query.centre,
          examination: query.examination,
        },
      });

      if (data) {
        setResult(data);
        console.log(data);
      }
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getSessionCandidates = async (examSession: string) => {
    try {
      const { data } = await httpService.get("/server/sessioncandidates", {
        params: {
          centre: query.centre,
          examination: query.examination,
          examSession,
        },
      });

      if (data) {
        setSessionCandidates(data);
        console.log(data);
      }
    } catch (error) {
      toastError(error);
    }
  };
  return (
    <div>
      <PageTitle title="Server candidate view" />
      <div className="col-lg-3 mb-3">
        <Alert severity="info">
          <AlertTitle>centre {query.centreId}</AlertTitle>
          <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
            {result?.cbtExamination.name}
          </Typography>
        </Alert>
      </div>

      <div className="bg-light p-3 col-lg-8 my-3">
        <div className="row">
          <div className="col-lg-3">
            <Typography variant="body2">Total candidates</Typography>
            <Typography variant="body2">{result?.totalCandidates}</Typography>
          </div>
          <div className="col-lg-3">
            <Typography variant="body2">Total sessions</Typography>
            <Typography variant="body2">{result?.sessions.length}</Typography>
          </div>
        </div>
      </div>
      <div className="my-3 p-3 col-lg-6 bg-light">
        <Typography className="mb-3" variant="h6" color="primary">
          Sessions
        </Typography>
        <Table className="bg-light" striped borderless>
          <thead>
            <tr>
              <th>#</th>
              <th>Session</th>
              <th>Candiates</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {result?.sessions.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.examSession.sessionName}</td>
                <td>{item.candidates}</td>
                <td>
                  <IconButton
                    onClick={() => {
                      getSessionCandidates(item.examSession._id);
                      setExamSession(item.examSession);
                    }}
                  >
                    <Visibility />
                  </IconButton>
                  {/* <button className="btn btn-primary">View</button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Modal
        size="lg"
        show={sessionCandidates.length > 0 ? true : false}
        onHide={() => setSessionCandidates([])}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Typography
              variant="h6"
              color="primary"
              sx={{ textTransform: "capitalize" }}
            >
              {examSession.sessionName} candidates
            </Typography>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ overflowY: "scroll", maxHeight: "50vh" }}>
            <Table className="bg-light" striped borderless>
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Index Number</th>
                </tr>
              </thead>
              <tbody>
                {sessionCandidates.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Typography
                        variant="body2"
                        sx={{ textTransform: "uppercase" }}
                      >
                        {index + 1}.
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="body2"
                        sx={{ textTransform: "uppercase" }}
                      >
                        {item.firstName}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="body2"
                        sx={{ textTransform: "uppercase" }}
                      >
                        {item.lastName}
                      </Typography>
                    </td>
                    <td>
                      <Typography
                        variant="body2"
                        sx={{ textTransform: "uppercase" }}
                      >
                        {item.indexNumber}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setSessionCandidates([])}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ServerCandidates;
