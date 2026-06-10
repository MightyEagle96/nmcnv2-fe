import { useEffect, useState } from "react";
import { toastError } from "../../../components/ErrorToast";
import { httpService } from "../../../httpService";
import {
  Alert,
  AlertTitle,
  Button,
  Chip,
  TextField,
  Typography,
} from "@mui/material";

import PageTitle from "../../../components/PageTitle";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";

export interface IActiveExamAndServers {
  activeExam: { _id: string; name: string };
  selectedServers: {
    _id: string;
    cbtExamination: string;
    centre: { _id: string; centreId: string };
  }[];
}
const Server = () => {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);
  const [centres, setCentres] = useState([]);
  const [total, setTotal] = useState(0);
  const [activeExamination, setActiveExamination] =
    useState<IActiveExamAndServers | null>(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });
  const getServers = async () => {
    try {
      const { data } = await httpService("server/viewcentres", {
        params: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
        },
      });

      setCentres(data.centres);
      setTotal(data.total);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    getServers();
    getActiveExaminationAndServers();
  }, [paginationModel]);

  const generateServers = () => {
    Swal.fire({
      icon: "question",
      title: "Generate Servers?",
      text: "Are you sure you want to generate servers?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await httpService.post("server/generateservers", {
            count,
          });
          if (data) {
            toast.success(data);
            setShow(false);
          }
        } catch (error) {
          toastError(error);
        }
      }
    });
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      renderCell: (params: any) => (
        <span className="text-capitaliz text-muted">{params.row.id}.</span>
      ),
    },
    { field: "centreId", headerName: "Centre ID", width: 200 },
    { field: "password", headerName: "Password", width: 200 },
  ];

  const getActiveExaminationAndServers = async () => {
    try {
      const { data } = await httpService("server/activeexamandservers");
      if (data) {
        setActiveExamination(data);
        console.log(data);
      }
    } catch (error) {
      toastError(error);
    }
  };
  return (
    <div>
      <PageTitle title="Server Management Console" />
      <div className="mb-3">
        <Button variant="contained" onClick={() => setShow(!show)}>
          generate servers
        </Button>
      </div>

      <div className="row">
        <div className="col-lg-5">
          <DataGrid
            columns={columns}
            rows={centres}
            paginationMode="server"
            rowCount={total}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </div>
        <div className="col-lg-7">
          {activeExamination && (
            <div>
              <div className="mb-3">
                <Alert severity="info">
                  <AlertTitle sx={{ fontWeight: 300 }}>
                    Active Examination
                  </AlertTitle>
                  <Typography
                    fontWeight={700}
                    variant="h4"
                    textTransform={"uppercase"}
                  >
                    {activeExamination.activeExam.name}
                  </Typography>
                </Alert>
              </div>
              <div>
                <div className="d-flex flex-row">
                  {activeExamination.selectedServers.map((server) => (
                    <Chip
                      component={Link}
                      to={`/servercandidates?server=${server.centre._id}&exam=${activeExamination.activeExam._id}&centreId=${server.centre.centreId}`}
                      clickable
                      sx={{ mr: 1, mb: 1 }}
                      key={server._id}
                      label={`Centre ${server.centre.centreId}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        centered
        show={show}
        backdrop="static"
        onHide={() => setShow(!show)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Generate Servers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField
            fullWidth
            variant="standard"
            label="Number of servers"
            type="number"
            onChange={(e) => setCount(e.target.value as unknown as number)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={generateServers}>Generate</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Server;
