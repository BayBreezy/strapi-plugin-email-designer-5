import { Box, Tabs } from "@strapi/design-system";
import { EditorRef } from "react-email-editor";
import { useTr } from "../../hooks/useTr";
import { EmailConfig, EmailTemplate } from "../../types";
import VersionHistoryTab from "../VersionHistoryTab";
import DesignerHTMLEditor from "./DesignerHTMLEditor";
import DesignerTextEditor from "./DesignerTextEditor";

interface DesignerTabsContainerProps {
  mode: "html" | "text" | "history";
  isCore: boolean;
  templateId?: string;
  templateData?: EmailTemplate;
  bodyText: string;
  emailEditorRef: React.RefObject<EditorRef>;
  editorOptions?: EmailConfig;
  serverConfigLoaded: boolean;
  onModeChange: (mode: "html" | "text" | "history") => void;
  onBodyTextChange: (text: string) => void;
  onHTMLEditorLoad: () => void;
  onVersionRestore: () => void;
}

const DesignerTabsContainer = ({
  mode,
  isCore,
  templateId,
  templateData,
  bodyText,
  emailEditorRef,
  editorOptions,
  serverConfigLoaded,
  onModeChange,
  onBodyTextChange,
  onHTMLEditorLoad,
  onVersionRestore,
}: DesignerTabsContainerProps) => {
  const translate = useTr();

  const handleTabChange = (selected: "html" | "text" | "history") => {
    onModeChange(selected);

    if (selected === "text" && !bodyText && templateData?.bodyHtml) {
      // Generate text from HTML if bodyText is empty
      emailEditorRef.current?.editor?.exportHtml((data: any) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = data.html;
        onBodyTextChange(tempDiv.textContent || tempDiv.innerText || "");
      });
    }
  };

  return (
    <Box style={{ flex: 1, display: "flex", height: "calc(100dvh - 80px)" }}>
      <Tabs.Root value={mode} onValueChange={handleTabChange}>
        <Tabs.List aria-label="Switch between the html, text and history design">
          <Tabs.Trigger value="html">{translate("designer.tab.html")}</Tabs.Trigger>
          <Tabs.Trigger value="text">{translate("designer.tab.text")}</Tabs.Trigger>
          {!isCore && templateId !== "new" && (
            <Tabs.Trigger value="history">{translate("designer.tab.history")}</Tabs.Trigger>
          )}
        </Tabs.List>

        <Tabs.Content style={{ height: "calc(100vh - 160px)" }} value="html">
          <DesignerHTMLEditor
            emailEditorRef={emailEditorRef}
            editorOptions={editorOptions}
            serverConfigLoaded={serverConfigLoaded}
            onLoad={onHTMLEditorLoad}
          />
        </Tabs.Content>

        <Tabs.Content style={{ height: "calc(100vh - 160px)", padding: "20px" }} value="text">
          <DesignerTextEditor bodyText={bodyText} onChange={onBodyTextChange} />
        </Tabs.Content>

        {!isCore && templateId !== "new" && (
          <Tabs.Content style={{ height: "calc(100vh - 160px)", overflow: "auto" }} value="history">
            <VersionHistoryTab templateId={templateId || ""} onVersionRestore={onVersionRestore} />
          </Tabs.Content>
        )}
      </Tabs.Root>
    </Box>
  );
};

export default DesignerTabsContainer;
