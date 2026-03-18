import { Button, Divider, Typography } from "@mui/material";
import { ApplicationNavigation } from "../../../routes/CaosceRoutes";
import { useSearchParams } from "react-router-dom";
import { FaFileExcel, FaFileWord, FaUpload } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { httpService } from "../../../httpService";
import { toastError } from "../../../components/ErrorToast";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
function Items() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState<boolean>();
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [items, setItems] = useState([]);

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

  const getProcedureItems = async () => {
    setLoading(true);
    try {
      const { data } = await httpService.get("/caosce/procedureitem", {
        params: { _id: query.id },
      });
      if (data) {
        setItems(data);
        console.log(data);
      }
    } catch (error) {
      toastError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getProcedureItems();
  }, []);

  const maxOptions = Math.max(
    ...items.map(
      (row: { question: string; options: []; correctAnswer: string }) =>
        row.options?.length ?? 0,
    ),
  );
  const dynamicOptionColumns = Array.from({ length: maxOptions }).map(
    (_, index) => ({
      field: `option${index}`,
      headerName: `Option ${String.fromCharCode(65 + index)}`,
      width: 200,
      renderCell: (params: any) => params.row.options?.[index] ?? "-",
    }),
  );

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "question", headerName: "Question", width: 300 },
    ...dynamicOptionColumns,
    { field: "correctAnswer", headerName: "Correct Answer", width: 300 },
  ];

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
      <div className="d-flex flex-row mb-4">
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
              <Button
                endIcon={<FaUpload />}
                loading={loading}
                loadingPosition="end"
                disabled={!excelFile}
                onClick={uploadFile}
              >
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
      <div className="mb-3">
        <DataGrid columns={columns} rows={items} loading={loading} />
      </div>
    </div>
  );
}

export default Items;
