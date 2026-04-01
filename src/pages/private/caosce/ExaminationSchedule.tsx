import { useSearchParams } from "react-router-dom";
import { toastError } from "../../../components/ErrorToast";
import { httpService } from "../../../httpService";
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Add, Clear, Done } from "@mui/icons-material";
import { toast } from "react-toastify";
import { Modal, Table } from "react-bootstrap";
import { pink } from "@mui/material/colors";

export interface ICaosceExamination {
  cbtExamination: { _id: string; name: string; code: string };
  createdBy: string;
  componentsScheduledTime: Date;
  procedureScheduledTime: Date;
  _id: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  programmesAndProcedures: IProgrammeAndProcedures[];
}

interface IProgramme {
  _id: string;
  name: string;
  code: string;
  viva: number;
  procedure: number;
  research: number;
  clientCare: number;
  expectantFamilyCare: number;
}
interface IProgrammeAndProcedures {
  programme: { name: string; code: string; procedure: number; _id: string };
  procedures: string[];
}
type IProcedureOverview = {
  activityCount: number;
  code: string;
  itemCount: number;
  name: string;
  procedureCount: number;
  hasRequirements: boolean;
  hasInstructions: boolean;
  id: number;
  maxScore: number;
  createdAt: string;
  _id: string;
};
function ExaminationSchedule() {
  const [params] = useSearchParams();

  const caosce = params.get("caosce");
  const [loading, setLoading] = useState<boolean>(false);
  const [programmeProcedures, setProgrammeProcedures] = useState<
    IProcedureOverview[]
  >([]);
  const [examination, setExamination] = useState<ICaosceExamination | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false);
  const [programme, setProgramme] = useState<IProgramme | null>(null);
  const [totalMaxScore, setTotalMaxScore] = useState(0);
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([]);

  const handleProcedureChange = (procedureId: string) => {
    setSelectedProcedures((prev) => {
      if (prev.includes(procedureId)) {
        // Deselect
        return prev.filter((id) => id !== procedureId);
      } else {
        // Select
        return [...prev, procedureId];
      }
    });
  };

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await httpService.get("caosce/examination", {
        params: { _id: caosce },
      });

      if (data) {
        setExamination(data);
        console.log(data);
      }
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return <LoadingSection />;
  }

  const viewProgrammeProcedures = async (programme: string) => {
    try {
      const { data } = await httpService("caosce/programmeprocedures", {
        params: { _id: programme },
      });
      if (data) {
        setProgrammeProcedures(data);
        console.log(data);
        setShowModal(true);
      }

      if (data.length === 0) {
        toast.info("No programme procedures found");
        setShowModal(false);
      }
    } catch (error) {
      toastError(error);
      setShowModal(false);
    }
  };

  const customSeverity = () => {
    if (!programme?.procedure) return;
    if (totalMaxScore < programme?.procedure) {
      return "info";
    }
    if (totalMaxScore === programme?.procedure) {
      return "success";
    }

    if (totalMaxScore > programme?.procedure) {
      return "error";
    }
  };
  return (
    <div>
      {examination && (
        <div>
          <div className="mb-4">
            <Typography gutterBottom variant="caption">
              CAOSCE EXAMINATION
            </Typography>
            <Typography
              variant="h4"
              fontWeight={700}
              textTransform={"uppercase"}
            >
              {examination.cbtExamination.name}
            </Typography>
          </div>
          <div>
            {examination.programmesAndProcedures.map((p, i) => (
              <div className="mb-4">
                <div className="mb-4">
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={3}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "background.paper",
                    }}
                  >
                    {/* Programme Info */}
                    <Stack spacing={0.5}>
                      <Typography variant="overline" color="text.secondary">
                        Programme {i + 1}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{ textTransform: "uppercase", fontWeight: 600 }}
                        color="primary"
                      >
                        {p.programme.name}
                      </Typography>
                    </Stack>

                    <Divider orientation="vertical" flexItem />

                    {/* Procedure Score */}
                    <Stack>
                      <Typography variant="body2" color="text.secondary">
                        Procedure Score
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {p.programme.procedure}
                      </Typography>
                    </Stack>

                    <Divider orientation="vertical" flexItem />

                    {/* Action */}
                    <Button
                      color="error"
                      startIcon={<Add />}
                      size="small"
                      onClick={() => {
                        viewProgrammeProcedures(p.programme._id);

                        setProgramme(p.programme as IProgramme);
                      }}
                    >
                      Add Procedure
                    </Button>
                  </Stack>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Modal
        backdrop="static"
        size="xl"
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setProgramme(null);
          setProgrammeProcedures([]);
          setTotalMaxScore(0);
        }}
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-capitalize">
            {programme?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-lg-4">
            <Alert severity={customSeverity()}>
              {totalMaxScore}/{programme?.procedure}
            </Alert>
          </div>
          <div
            className="p-3"
            style={{ overflowY: "scroll", maxHeight: "60vh" }}
          >
            <Typography color="GrayText">
              Procedures: {programmeProcedures.length}
            </Typography>
            <Table striped borderless className="align-middle">
              <thead>
                <tr>
                  <th>
                    <Done />
                  </th>
                  <th>#</th>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Instructions</th>
                  <th>Activities</th>
                  <th>Max Score</th>
                  <th>Date Created</th>
                </tr>
              </thead>
              <tbody>
                {programmeProcedures.map((c) => (
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <Checkbox
                          disabled={
                            !c.hasRequirements ||
                            !c.hasInstructions ||
                            c.maxScore === 0 ||
                            (selectedProcedures.length >= 3 &&
                              !selectedProcedures.includes(c._id))
                          }
                          sx={{
                            color: pink[800],
                            "&.Mui-checked": {
                              color: pink[600],
                            },
                          }}
                          onChange={(e) => {
                            setTotalMaxScore((prev) =>
                              e.target.checked
                                ? prev + c.maxScore
                                : prev - c.maxScore,
                            );

                            handleProcedureChange(c._id);
                          }}
                        />
                      </div>
                    </td>
                    <td>{c.id}.</td>
                    <td>
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-capitalize">{c.name}</span>
                      </div>
                    </td>
                    <td className="text-uppercase">{c.code}</td>
                    <td>
                      {c.hasInstructions ? (
                        <Done color="success" />
                      ) : (
                        <Clear color="error" />
                      )}
                    </td>
                    <td>
                      {c.hasRequirements ? (
                        <Done color="success" />
                      ) : (
                        <Clear color="error" />
                      )}
                    </td>

                    <td>{c.maxScore}</td>
                    <td>{new Date(c.createdAt).toLocaleString("en-US")}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}

export default ExaminationSchedule;

function LoadingSection() {
  return (
    <Box>
      {/* Title Skeleton */}
      <Skeleton variant="text" width={180} height={20} />
      <Skeleton variant="text" width={400} height={50} sx={{ mb: 4 }} />

      {/* Programme Cards Skeleton */}
      {[1, 2, 3].map((_, i) => (
        <Box key={i} sx={{ mb: 4 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={3}
            sx={{
              p: 2,
              borderRadius: 2,
            }}
          >
            <Stack spacing={1}>
              <Skeleton variant="text" width={120} />
              <Skeleton variant="text" width={200} height={30} />
            </Stack>

            <Divider orientation="vertical" flexItem />

            <Stack spacing={1}>
              <Skeleton variant="text" width={100} />
              <Skeleton variant="text" width={60} height={30} />
            </Stack>

            <Divider orientation="vertical" flexItem />

            <Skeleton variant="rectangular" width={130} height={35} />
          </Stack>
        </Box>
      ))}
    </Box>
  );
}
