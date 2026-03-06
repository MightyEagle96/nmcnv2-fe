import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { ApplicationNavigation } from "../../../routes/CaosceRoutes";
import { Menu } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { httpService } from "../../../httpService";
import { toastError } from "../../../components/ErrorToast";
import { toast } from "react-toastify";

function Activities() {
  const [params] = useSearchParams();
  const [creating, setCreating] = useState(false);
  const [show, setShow] = useState(false);
  const [activities, setActivities] = useState<
    { activity: string; score: number }[]
  >([]);

  const [activity, setActivity] = useState({
    activity: "",
    score: "",
  });

  // const data = params.getAll(["id", "name"]);
  const query = {
    id: params.get("id"),
    procedure: params.get("procedure"),
    programme: params.get("programme"),
    programmename: params.get("programmename"),
  };

  const addActivity = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: "Add Activity",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setCreating(true);
        try {
          const { data } = await httpService.patch(
            `/caosce/addactivitytoprocedure/${query.id}`,
            activity,
          );

          toast.success(data);
          setShow(false);
          getActivities();
          setActivity({
            activity: "",
            score: "",
          });
        } catch (error) {
          toastError(error);
        }
        setCreating(false);
      }
    });
  };

  const getActivities = async () => {
    try {
      const { data } = await httpService.get(
        `/caosce/procedureactivities/${query.id}`,
      );

      if (data) {
        setActivities(data);
      }
      console.log(data);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    getActivities();
  }, []);
  return (
    <div>
      <div className="mb-4">
        <Typography variant="h4" fontWeight={700}>
          ACTIVITIES
        </Typography>
      </div>
      <div className="mb-4">
        {query && (
          <ApplicationNavigation
            links={[
              {
                path: `/caosce/programme?id=${query.programme}`,
                name: query?.programmename?.toLocaleUpperCase() || "",
              },
            ]}
            pageTitle={query?.procedure?.toLocaleUpperCase() || ""}
          />
        )}
      </div>
      <div className="text-end">
        <Button
          onClick={() => setShow(!show)}
          variant="contained"
          color="error"
        >
          Add new activity
        </Button>
      </div>
      <div>
        <div className="row">
          <div className="col-lg-2">
            <Typography variant="h6">S.No</Typography>
          </div>
          <div className="col-lg-5">
            <Typography variant="h6">Activity</Typography>
          </div>
          <div className="col-lg-2">
            <Typography variant="h6">Score</Typography>
          </div>
          <div className="col-lg-2">
            <Typography variant="h6">Modify</Typography>
          </div>
        </div>
        <Divider />
        {activities.map((c, i) => (
          <div className="row py-2 border-bottom d-flex align-items-center">
            <div className="col-lg-2">
              <Typography>{i + 1}</Typography>
            </div>
            <div className="col-lg-5">
              <Typography>{c.activity}</Typography>
            </div>
            <div className="col-lg-2">
              <Typography>{c.score}</Typography>
            </div>
            <div className="col-lg-2">
              <IconButton>
                <Menu />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
      <Modal
        size="xl"
        backdrop="static"
        show={show}
        onHide={() => {
          setShow(!show);

          setActivity({
            activity: "",
            score: "",
          });
        }}
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Add a new activity</Modal.Title>
        </Modal.Header>
        <form onSubmit={addActivity}>
          <Modal.Body>
            <div className="p-3">
              <div className="mb-4">
                <TextField
                  onChange={(e) =>
                    setActivity({ ...activity, activity: e.target.value })
                  }
                  multiline
                  maxRows={3}
                  label="Activity"
                  fullWidth
                  variant="outlined"
                />
              </div>
              <div className="mb-4">
                <div className="col-lg-3">
                  <TextField
                    fullWidth
                    select
                    label="Activity Score"
                    onChange={(e) =>
                      setActivity({ ...activity, score: e.target.value })
                    }
                  >
                    {activityScores.map((value, i) => (
                      <MenuItem key={i} value={value}>
                        {" "}
                        {value}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button
              loading={creating}
              type="submit"
              variant="contained"
              color="error"
            >
              Save
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default Activities;

const activityScores = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
