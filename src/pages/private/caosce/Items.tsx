import { Button, Typography, Stack } from "@mui/material";
import { ApplicationNavigation } from "../../../routes/CaosceRoutes";
import { useSearchParams } from "react-router-dom";
import { FaFileExcel, FaFileWord, FaTrash, FaUpload } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { httpService } from "../../../httpService";
import { toastError } from "../../../components/ErrorToast";
import { toast } from "react-toastify";
import { DataGrid } from "@mui/x-data-grid";
import { Badge, Modal } from "react-bootstrap";
import parser from "html-react-parser";
import Swal from "sweetalert2";
interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}
function Items() {
  const [params] = useSearchParams();
  const [loading, setLoading] = useState<boolean>();
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [items, setItems] = useState([]);

  const query = {
    id: params.get("id"),
    procedure: params.get("procedure"),
    programme: params.get("programme"),
    programmename: params.get("programmename"),
  };

  const [wordUpload, setWordUpload] = useState<IQuestion[]>([]);
  const [summary, setSummary] = useState({
    stemsWithoutQuestion: 0,
    stemsWithoutOptions: 0,
    stemsWithoutCorrectAnswer: 0,
    incompleteStems: 0,
  });

  const fileRef = useRef<HTMLInputElement | null>(null);

  const wordFileRef = useRef<HTMLInputElement | null>(null);
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

      if (data) {
        toast.success(data);
        getProcedureItems();
      }

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

  const uploadWordFile = async () => {
    if (!wordFile) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("testform", wordFile);

    try {
      const { data } = await httpService.post(
        "/caosce/uploaditemsword",
        formData,
        {
          params: { _id: query.id },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (data) {
        setWordUpload(data.finalData);
        setSummary(data.summary);
        console.log(data);
      }

      setWordFile(null);

      if (wordFileRef.current) {
        wordFileRef.current.value = "";
      }
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  const uploadItems = () => {
    Swal.fire({
      icon: "question",
      title: "Upload Items",
      text: "Are you sure you want to upload these items",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const { data } = await httpService.post(
            "caosce/uploaditems",
            wordUpload,
            {
              params: { id: query.id },
            },
          );

          if (data) {
            setWordUpload([]);
            setSummary({
              stemsWithoutQuestion: 0,
              stemsWithoutOptions: 0,
              stemsWithoutCorrectAnswer: 0,
              incompleteStems: 0,
            });
            getProcedureItems();
            toast.success(data);
          }
        } catch (error) {
          toastError(error);
        }
        setLoading(false);
      }
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setExcelFile(e.target.files[0]);

      e.target.files = null;
    }
  };

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setWordFile(e.target.files[0]);

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
      renderCell: (params: any) => (
        <div
          dangerouslySetInnerHTML={{ __html: params.row.options[index] }}
        ></div>
      ),
    }),
  );

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "question",
      headerName: "Question",
      width: 300,
      renderCell: (params: any) => (
        <div dangerouslySetInnerHTML={{ __html: params.row.question }} />
      ),
    },
    ...dynamicOptionColumns,
    {
      field: "correctAnswer",
      headerName: "Correct Answer",
      width: 300,
      renderCell: (params: any) => (
        <div
          dangerouslySetInnerHTML={{ __html: params.row.correctAnswer }}
        ></div>
      ),
    },
  ];

  const deleteQuestions = () => {
    Swal.fire({
      icon: "question",
      title: "Delete Items",
      text: "Are you sure you want to delete these items",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const { data } = await httpService.get("caosce/deleteitems", {
            params: { id: query.id },
          });

          if (data) {
            toast.success(data);
            getProcedureItems();
          }
        } catch (error) {
          toastError(error);
        }
        setLoading(false);
      }
    });
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
                onChange={handleWordChange}
                ref={wordFileRef}
              />
              <Button
                endIcon={<FaUpload />}
                loading={loading}
                loadingPosition="end"
                disabled={!wordFile}
                onClick={uploadWordFile}
              >
                Upload file
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-3">
        <div className="text-end mb-3">
          <Button color="error" endIcon={<FaTrash />} onClick={deleteQuestions}>
            Delete Questions
          </Button>
        </div>
        <DataGrid columns={columns} rows={items} loading={loading} />
      </div>
      <Modal
        size="xl"
        show={wordUpload.length > 0}
        onHide={() => setWordUpload([])}
      >
        <Modal.Header className="border-0" closeButton>
          <Modal.Title>UPLOAD SUMMARY</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ maxHeight: "60vh", overflowY: "scroll" }}>
            <div className="row mb-4">
              <div className="col-lg-3">
                <Typography variant="caption" color="GrayText">
                  Stems without questions
                </Typography>
                <Typography variant="h6">
                  {summary.stemsWithoutQuestion}
                </Typography>
              </div>
              <div className="col-lg-3">
                <Typography variant="caption" color="GrayText">
                  Stems without options
                </Typography>
                <Typography variant="h6">
                  {summary.stemsWithoutOptions}
                </Typography>
              </div>
              <div className="col-lg-3">
                <Typography variant="caption" color="GrayText">
                  Stems without correct answer
                </Typography>
                <Typography variant="h6">
                  {summary.stemsWithoutCorrectAnswer}
                </Typography>
              </div>
              <div className="col-lg-3">
                <Typography variant="caption" color="GrayText">
                  Incomplete stems
                </Typography>
                <Typography variant="h6">{summary.incompleteStems}</Typography>
              </div>
            </div>
            {wordUpload.map((c, i) => (
              <div key={i} className="mb-2 borer-bottom  ">
                <div className="mb-2">
                  <Typography variant="overline" gutterBottom>
                    Question {i + 1}
                  </Typography>
                  <div className="mb-1">{parser(c.question)}</div>
                  <div className="mb-1">
                    {c.options.map((o, j: number) => (
                      <div key={j}>
                        <Stack direction="row">
                          <div className="me-1">
                            {String.fromCharCode(65 + j)}.
                          </div>
                          <div className="me-2">{parser(o)} </div>
                          <div>
                            {o === c.correctAnswer && (
                              <Badge>CORRECT ANSWER</Badge>
                            )}
                          </div>
                        </Stack>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={uploadItems}
            loading={loading}
            disabled={
              summary.stemsWithoutQuestion > 0 ||
              summary.stemsWithoutOptions > 0 ||
              summary.stemsWithoutCorrectAnswer > 0
            }
          >
            {" "}
            Upload items
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Items;
