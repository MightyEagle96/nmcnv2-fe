import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { httpService } from "../../../httpService";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { toastError } from "../../../components/ErrorToast";
import { PageLoading } from "./ProcedureInstructions";
import { Button, Typography } from "@mui/material";
import { ApplicationNavigation } from "../../../routes/CaosceRoutes";
import { Editor } from "@tinymce/tinymce-react";
import { apiKey } from "../../../types/IAccount";

function ProcedureRequirements() {
  const [content, setContent] = useState(""); // what user is editing
  const [editorReady, setEditorReady] = useState(false);
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const query = {
    programme: params.get("programme"),
    procedure: params.get("procedure"),
    name: params.get("name"),
  };

  const updateRequirements = async () => {
    Swal.fire({
      icon: "question",
      title: "Update Instruction",
      text: "Are you sure you want to update procedure requirements",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const { data } = await httpService.patch(
            `caosce/updaterequirements?procedureId=${query.procedure}`,
            { requirements: content },
          );
          if (data) {
            toast.success(data);
          }
        } catch (error) {
          toastError(error);
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const viewRequirements = async () => {
    try {
      setPageLoading(true);

      const { data } = await httpService.get("caosce/viewrequirements", {
        params: { procedureId: query.procedure },
      });

      if (data) {
        setContent(data);
      }
    } catch (error) {
      toastError(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    viewRequirements();
  }, []);

  if (pageLoading) {
    <PageLoading />;
  }
  return (
    <div>
      {" "}
      <div className="mb-4">
        <Typography variant="h4" fontWeight={700}>
          REQUIREMENTS
        </Typography>
      </div>
      <div className="mb-4">
        <ApplicationNavigation
          links={[
            {
              path: `/caosce/programme?id=${query.programme}`,
              name: "Programme",
            },
          ]}
          pageTitle={query?.name?.toLocaleUpperCase() || ""}
        />
      </div>
      <Editor
        value={content}
        onEditorChange={(val) => setContent(val)}
        apiKey={apiKey}
        onInit={() => setEditorReady(true)}
        init={{
          height: 500,
          menubar: false,
          branding: false,

          plugins: ["lists", "link", "image", "table", "paste", "wordcount"],

          toolbar:
            "undo redo | blocks | " +
            "bold italic underline | " +
            "forecolor backcolor | " + // allow colors
            "bullist numlist | alignleft aligncenter alignright alignjustify | " +
            "table | link image | removeformat",

          /* Allowed block formats */
          block_formats:
            "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4",

          /* Lock typography */
          content_style: `
      body {
        font-family: 'Roboto', sans-serif;
        font-size: 14px;
        line-height: 1.7;
        color: #263238;
      }

      h1, h2, h3, h4 {
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
      }
    `,

          /* Paste discipline — preserve alignment/colors, remove junk */
          paste_as_text: false, // allow colors/alignment from TinyMCE
          paste_webkit_styles: "none", // remove webkit styles
          paste_remove_spans: true,
          paste_strip_class_attributes: "Mso", // remove Word classes but keep TinyMCE align/color classes

          valid_elements:
            "p[style|class],h1[style|class],h2[style|class],h3[style|class],h4[style|class]," +
            "span[style|class]," + // <-- Add this
            "ul,ol,li,strong,em,u,a[href|target],table,thead,tbody,tr,th,td,img[src|alt|width|height],br",

          /* Adjust to allow background-color if needed */
          invalid_styles: {
            "*": "font-size font-family line-height", // <-- Removed "background" to enable backcolor
          },

          /* Force alignments to output inline styles */
          formats: {
            alignleft: {
              selector: "p,h1,h2,h3,h4,td,th,div",
              styles: { textAlign: "left" },
            },
            aligncenter: {
              selector: "p,h1,h2,h3,h4,td,th,div",
              styles: { textAlign: "center" },
            },
            alignright: {
              selector: "p,h1,h2,h3,h4,td,th,div",
              styles: { textAlign: "right" },
            },
            alignjustify: {
              selector: "p,h1,h2,h3,h4,td,th,div",
              styles: { textAlign: "justify" },
            },
          },

          /* Tables should be semantic */
          table_default_attributes: {
            border: "1",
          },

          /* Fonts available in dropdown */
          font_family_formats:
            "Lato=Lato,sans-serif; Poppins=Poppins,sans-serif; Helvetica=Helvetica,Arial,sans-serif; Times New Roman='Times New Roman',serif",
        }}
      />
      <div className="mt-2">
        <Button
          variant="contained"
          loading={loading}
          onClick={updateRequirements}
        >
          UPDATE Requirements
        </Button>
      </div>
    </div>
  );
}

export default ProcedureRequirements;
