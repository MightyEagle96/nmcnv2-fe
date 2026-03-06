import { Typography } from "@mui/material";
import React from "react";
import { ApplicationNavigation } from "../../../routes/CaosceRoutes";
import { useSearchParams } from "react-router-dom";

function Items() {
  const [params] = useSearchParams();

  // const data = params.getAll(["id", "name"]);
  const query = {
    id: params.get("id"),
    procedure: params.get("procedure"),
    programme: params.get("programme"),
    programmename: params.get("programmename"),
  };

  console.log(query);
  return (
    <div>
      <div className="mb-4">
        <Typography variant="h4" fontWeight={700}>
          ITEMS
        </Typography>
      </div>
      <div>
        <ApplicationNavigation
          links={[
            {
              path: `/caosce/programme?id=${query.programme}`,
              name: query?.programmename,
            },
          ]}
          pageTitle={query?.procedure}
        />
      </div>
    </div>
  );
}

export default Items;
