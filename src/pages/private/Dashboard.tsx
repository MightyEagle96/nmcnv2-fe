import { Typography } from "@mui/material";

const Dashboard = () => {
  return (
    <div>
      <div className="mb-5">
        <Typography variant="h3" fontWeight={500}>
          Hello there
        </Typography>
      </div>

      <div className="row p-4 g-4">
        <div className="col-lg-3 p-3 bg-light m-1  ">
          <div className="d-flex justify-content-between">
            <div>
              <Typography>Examinations</Typography>
            </div>
            <div>
              <Typography>10</Typography>
            </div>
          </div>
        </div>
        <div className="col-lg-3 p-3 bg-light m-1 ">
          <div className="d-flex justify-content-between">
            <div>
              <Typography>Servers</Typography>
            </div>
            <div>
              <Typography>10</Typography>
            </div>
          </div>
        </div>
        <div className="col-lg-3 p-3 bg-light m-1 ">
          <div className="d-flex justify-content-between">
            <div>
              <Typography>Candidates</Typography>
            </div>
            <div>
              <Typography>10</Typography>
            </div>
          </div>
        </div>
        <div className="col-lg-3 p-3 bg-light m-1 ">
          <div className="d-flex justify-content-between">
            <div>
              <Typography>Programmes</Typography>
            </div>
            <div>
              <Typography>10</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
