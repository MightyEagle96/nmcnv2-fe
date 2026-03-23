import { useSearchParams } from "react-router-dom";
import { toastError } from "../../../components/ErrorToast";
import { httpService } from "../../../httpService";
import { useEffect, useState } from "react";
import { Button, Divider, Stack, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

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

interface IProgrammeAndProcedures {
  programme: { name: string; code: string; procedure: number };
  procedures: string[];
}
function ExaminationSchedule() {
  const [params] = useSearchParams();

  const caosce = params.get("caosce");
  const [loading, setLoading] = useState<boolean>(false);

  const [examination, setExamination] = useState<ICaosceExamination | null>(
    null,
  );

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
                    <Button color="error" startIcon={<Add />} size="small">
                      Add Procedure
                    </Button>
                  </Stack>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExaminationSchedule;
