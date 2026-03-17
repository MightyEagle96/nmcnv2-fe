import { Button, Typography } from "@mui/material";
import { ApplicationNavigation } from "../../../routes/CaosceRoutes";
import { useSearchParams } from "react-router-dom";
import { FaFileExcel, FaFileWord } from "react-icons/fa";
import { useRef, useState } from "react";
import { httpService } from "../../../httpService";
import { toastError } from "../../../components/ErrorToast";
import { toast } from "react-toastify";
function Items() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState<boolean>();
  const [excelFile, setExcelFile] = useState<File | null>(null);

  const query = {
    id: params.get("id"),
    procedure: params.get("procedure"),
    programme: params.get("programme"),
    programmename: params.get("programmename"),
  };

  const fileRef = useRef<HTMLInputElement | null>(null);
  const uploadFile = async () => {
    if (!excelFile) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      const { data } = await httpService.post(
        "/caosce/uploaditemsexcel",
        formData,
        {
          params: { _id: query.id },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data) toast.success(data);

      setExcelFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setExcelFile(e.target.files[0]);

      e.target.files = null;
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Typography variant="h4" fontWeight={700}>
          ITEMS
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
      <div className="d-flex flex-row">
        <div className="col-lg-4">
          <div className="d-flex flex-row align-items-center">
            <div>
              <FaFileExcel
                style={{ color: "#05a038", height: 80, width: 80 }}
              />
            </div>
            <div>
              <Typography gutterBottom color="GrayText">
                Upload Excel
              </Typography>
              <input
                className="form-control"
                type="file"
                id="testform"
                name="testform"
                accept=".xlsx"
                onChange={handleChange}
                ref={fileRef}
              />
              <Button disabled={!excelFile} onClick={uploadFile}>
                Upload file
              </Button>
            </div>
          </div>
        </div>
        <div className=" border-end"></div>
        <div className="col-lg-4">
          <div className="d-flex flex-row align-items-center">
            <div>
              <FaFileWord style={{ color: "#1454c3", height: 80, width: 80 }} />
            </div>
            <div>
              <Typography gutterBottom color="GrayText">
                Upload Word
              </Typography>
              <input
                className="form-control"
                type="file"
                id="testform"
                name="testform"
                accept=".doc, .docx"
                //onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Items;
