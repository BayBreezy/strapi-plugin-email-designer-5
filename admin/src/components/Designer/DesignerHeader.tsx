import { Box, Field, IconButton } from "@strapi/design-system";
import { ArrowLeft } from "@strapi/icons";
import styled from "styled-components";
import { useTr } from "../../hooks/useTr";
import DesignerActionMenu from "./DesignerActionMenu";

const Header = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 100%;
  height: 60px;
  align-items: center;
  gap: 10px;
`;

interface DesignerHeaderProps {
  isCore: boolean;
  coreEmailType?: string;
  templateReferenceId?: number | string;
  templateName?: string;
  subject?: string;
  bodyText?: string;
  mode: "html" | "text" | "history";
  errorRefId: string;
  emailEditorRef: React.RefObject<any>;
  onTemplateReferenceIdChange: (value: number | string) => void;
  onTemplateNameChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onSave: () => void;
  onGoBack: () => void;
}

const DesignerHeader = ({
  isCore,
  coreEmailType,
  templateReferenceId,
  templateName,
  subject,
  bodyText,
  mode,
  errorRefId,
  emailEditorRef,
  onTemplateReferenceIdChange,
  onTemplateNameChange,
  onSubjectChange,
  onSave,
  onGoBack,
}: DesignerHeaderProps) => {
  const translate = useTr();

  return (
    <Header>
      <IconButton
        style={{ marginTop: "19px", padding: "10px" }}
        label={translate("goBack")}
        onClick={onGoBack}
      >
        <ArrowLeft />
      </IconButton>

      {!isCore && (
        <Box style={{ width: "100%", maxWidth: "150px" }}>
          <Field.Root required error={errorRefId}>
            <Field.Label>{translate("input.label.templateReferenceId")}</Field.Label>
            <Field.Input
              onChange={(e: any) => onTemplateReferenceIdChange(e.target.value)}
              value={templateReferenceId ?? ""}
              type="number"
              placeholder={translate("input.placeholder.templateReferenceId")}
            />
            <Field.Error />
          </Field.Root>
        </Box>
      )}

      <Box style={{ width: "100%" }}>
        <Field.Root disabled={isCore} required>
          <Field.Label>{translate("input.label.templateName")}</Field.Label>
          <Field.Input
            disabled={isCore}
            value={
              isCore && coreEmailType
                ? translate(coreEmailType as "user-address-confirmation" | "reset-password")
                : templateName || ""
            }
            onChange={(e: any) => onTemplateNameChange(e.target.value)}
            placeholder={translate("input.placeholder.templateName")}
          />
          <Field.Error />
        </Field.Root>
      </Box>

      <Box style={{ width: "100%" }}>
        <Field.Root required>
          <Field.Label>{translate("input.label.subject")}</Field.Label>
          <Field.Input
            onChange={(e: any) => onSubjectChange(e.target.value)}
            value={subject || ""}
            placeholder={translate("input.placeholder.subject")}
          />
          <Field.Error />
        </Field.Root>
      </Box>

      {/* Only show action menu button in HTML mode(Email editor is displayed) */}
      {mode === "html" && (
        <Box style={{ width: "fit-content", maxWidth: "100px", marginTop: "19px" }}>
          <DesignerActionMenu emailEditorRef={emailEditorRef} subject={subject} bodyText={bodyText} />
        </Box>
      )}

      {/* Only show save button in HTML mode(Email editor is displayed) */}
      {mode === "html" && (
        <Box style={{ width: "100%", maxWidth: "100px" }}>
          <button
            onClick={onSave}
            style={{
              marginTop: "19px",
              height: "38px",
              width: "100%",
              padding: "0 16px",
              borderRadius: "4px",
              backgroundColor: "#4945ff",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {translate("save")}
          </button>
        </Box>
      )}
    </Header>
  );
};

export default DesignerHeader;
