import { useEffect, useState } from "react";
import { toastError } from "../../../components/ErrorToast";
import { httpService } from "../../../httpService";
import { Button, TextField } from "@mui/material";

import PageTitle from "../../../components/PageTitle";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";

// type ICentre = {
//   centreId: string;
//   password: string;
//   state: string;
//   name: string;
//   capacity: number;
// };
const Server = () => {
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);
  const [centres, setCentres] = useState([]);
  const [total, setTotal] = useState(0);

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
        <div className="col-lg-5"></div>
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
