import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  Menu,
  LinearProgress,
} from "@mui/material";
import { ApplicationNavigation } from "../../../routes/CaosceRoutes";
import { Menu as MenuIcon, MoreVert } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { httpService } from "../../../httpService";
import { toastError } from "../../../components/ErrorToast";
import { toast } from "react-toastify";
import { useRefresh } from "../../../context/RefreshContext";
import { useLoading } from "../../../context/LoadingContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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
  const [reordering, setReordering] = useState<boolean>(false);

  const { refresh } = useRefresh();
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
  }, [refresh]);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = activities.findIndex((a) => a._id === active.id);
    const newIndex = activities.findIndex((a) => a._id === over.id);

    const newArray = arrayMove(activities, oldIndex, newIndex);

    // Update order locally
    const reordered = newArray.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setActivities(reordered);

    console.log(reordered);

    try {
      const { data } = await httpService.patch("caosce/reorderactivities", {
        procedureId: query.id,
        activities: reordered,
      });

      if (data) {
        toast.success(data);
      }
    } catch (error) {
      toastError(error);
    }
    // Persist to backend
    //updateActivityOrder(reordered);
  };
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
      <div className="text-end mb-4">
        <Button
          onClick={() => setShow(!show)}
          variant="contained"
          color="error"
        >
          Add new activity
        </Button>
      </div>
      <div className="p-4 rounded border">
        <div className="row mb-3">
          <div className="col-lg-1">
            <Typography variant="h6">S.No</Typography>
          </div>
          <div className="col-lg-5">
            <Typography variant="h6">Activity</Typography>
          </div>
          <div className="col-lg-2">
            <Typography variant="h6">Score</Typography>
          </div>
          <div className="col-lg-1">
            <Typography variant="h6">Action</Typography>
          </div>
          <div className="col-lg-2">
            <Typography variant="h6">Modify</Typography>
          </div>
        </div>
        {reordering ? <LinearProgress /> : <Divider />}

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={activities.map((a) => a._id)}
            strategy={verticalListSortingStrategy}
          >
            {activities.map((c, i) => (
              <SortableRow
                key={i}
                id={c._id}
                c={c}
                i={i}
                getActivities={getActivities}
                reodering={reordering}
              />
            ))}
          </SortableContext>
        </DndContext>
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

function ActionMenu({ row }: any) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showEdit, setShowEdit] = useState(false);

  const { refresh, setRefresh } = useRefresh();

  const { loading, setLoading } = useLoading();

  const [params] = useSearchParams();

  const query = {
    id: params.get("id"),
    procedure: params.get("procedure"),
    programme: params.get("programme"),
    programmename: params.get("programmename"),
  };

  const [activity, setActivity] = useState<{
    activity: string;
    score: string;
  }>({
    activity: "",
    score: "",
  });

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    // Initialize form with current row data
    setActivity({ ...row });
    setShowEdit(true);
    handleClose();
  };

  const handleDelete = () => {
    handleClose();

    Swal.fire({
      icon: "question",
      title: "Delete Activity",
      text: "Are you sure you want to delete this activity?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const { data } = await httpService.delete(
            `caosce/deleteactivity?procedureId=${query.id}&activityId=${row._id}`,
          );
          if (data) {
            toast.success(data);
            setRefresh(!refresh);
          }
          setLoading(false);
        } catch (error) {
          toastError(error);
        }
      }
    });
  };

  const editActivity = (e: React.FormEvent) => {
    e.preventDefault();

    Swal.fire({
      icon: "question",
      title: "Update this activity",
      text: "Are you sure you want to update this activity?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          console.log({ activity });
          setLoading(true);
          const { data } = await httpService.patch(
            `caosce/updateprocedureactivity?procedureId=${query.id}&activityId=${row._id}`,
            activity,
          );
          if (data) {
            toast.success(data);
            setRefresh(!refresh);
            setShowEdit(false);
          }
          setLoading(false);
        } catch (error) {
          toastError(error);
          setLoading(false);
        }
      }
    });
  };
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVert />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      <Modal
        show={showEdit}
        onHide={() => setShowEdit(false)}
        backdrop="static"
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Activity</Modal.Title>
        </Modal.Header>

        <form onSubmit={editActivity}>
          <Modal.Body>
            <div className="p-3">
              <div className="mb-4">
                <TextField
                  onChange={(e) =>
                    setActivity({ ...activity, activity: e.target.value })
                  }
                  multiline
                  value={activity.activity}
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
                    value={activity.score}
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
              loading={loading}
              type="submit"
              variant="contained"
              color="error"
            >
              Save
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

const SortableRow = ({ id, c, i, getActivities, reodering }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="row py-2 border-bottom d-flex align-items-center"
    >
      <div className="col-lg-1 border-end">
        <Typography variant="body2">{i + 1}</Typography>
      </div>

      <div className="col-lg-5 border-end">
        <Typography variant="body2">{c.activity}</Typography>
      </div>

      <div className="col-lg-2 border-end">
        <Typography variant="body2">{c.score}</Typography>
      </div>

      <div className="col-lg-1 border-end">
        <ActionMenu row={c} getActivities={getActivities} />
      </div>

      {/* Drag Handle */}
      <div className="col-lg-2">
        <IconButton disabled={reodering} {...attributes} {...listeners}>
          <MenuIcon />
        </IconButton>
      </div>
    </div>
  );
};
