import { Typography } from "@mui/material";
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
              name: query?.programmename?.toLocaleUpperCase(),
            },
          ]}
          pageTitle={query?.procedure?.toLocaleUpperCase()}
        />
      </div>
    </div>
  );
}

export default Items;
