import { Typography } from "@mui/material";

type Props = {
  title: string;
};

function PageTitle({ title }: Props) {
  return (
    <div className="mb-5">
      <Typography variant="h4" fontWeight={700} color="GrayText">
        {title}
      </Typography>
    </div>
  );
}

export default PageTitle;
