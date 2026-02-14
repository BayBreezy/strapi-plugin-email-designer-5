import { Page } from "@strapi/admin/strapi-admin";
import { Box, Button, Field, IconButton, Tabs, Textarea } from "@strapi/design-system";
import { ArrowLeft } from "@strapi/icons";
import { useNotification } from "@strapi/strapi/admin";
import { isEmpty } from "lodash";
import { memo, StrictMode, useCallback, useEffect, useRef, useState } from "react";
import { EditorRef, EmailEditor } from "react-email-editor";
import { useNavigate, useParams } from "react-router-dom";
import striptags from "striptags";
import styled from "styled-components";
import ImportSingleDesign from "../components/ImportSingleDesign";
import VersionHistoryTab from "../components/VersionHistoryTab";
import { getUrl, standardEmailRegistrationTemplate } from "../constants";
import { useTr } from "../hooks/useTr";
import { PLUGIN_ID } from "../pluginId";
import {
  createTemplate,
  getCoreTemplate,
  getFullEditorConfig,
  getTemplateById,
  updateCoreTemplate,
} from "../services";
import { EmailConfig, EmailTemplate } from "../types";
import { shallowIsEqual } from "../utils/helpers";

const DesignerContainer = styled.div`
  padding: 18px 30px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Header = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 100%;
  height: 60px;
  align-items: center;
  gap: 10px;
`;

const Designer = ({ isCore = false }: { isCore?: boolean }) => {
  const emailEditorRef = useRef<EditorRef>(null);
  const navigate = useNavigate();
  const translate = useTr();

  const { templateId, coreEmailType } = useParams();
  const [templateData, setTemplateData] = useState<EmailTemplate>();
  // Error state of the referenceId field
  const [errorRefId, setErrorRefId] = useState("");
  const [bodyText, setBodyText] = useState("");
  // Sets the mode of the editor to either html, text, or history
  const [mode, setMode] = useState<"html" | "text" | "history">("html");
  // State to check if the server config has been loaded
  const [serverConfigLoaded, setServerConfigLoaded] = useState(false);
  // State to store the editor options passed from the server
  const [editorOptions, setEditorOptions] = useState<EmailConfig>();
  const { toggleNotification } = useNotification();

  const saveDesign = async () => {
    if (!coreEmailType && !templateData?.templateReferenceId) {
      toggleNotification({
        type: "danger",
        title: translate("error.noReferenceId.title"),
        message: translate("error.noReferenceId.message"),
      });
      setErrorRefId("Required"); // trigger error on TextInput field
      return;
    }
    setErrorRefId("");

    let design, html, response, localBodyText;

    try {
      await new Promise<void>((resolve) => {
        emailEditorRef.current?.editor?.exportHtml((data: any) => {
          ({ design, html } = data);
          emailEditorRef.current?.editor?.exportPlainText((data: any) => {
            localBodyText = data.text || "";
            resolve();
          });
        });
      });
    } catch (error) {
      console.log(error);
      return;
    }

    try {
      if (templateId) {
        response = await createTemplate(templateId, {
          name: templateData?.name || translate("noName"),
          templateReferenceId: templateData?.templateReferenceId,
          subject: templateData?.subject || "",
          design,
          bodyText: localBodyText,
          bodyHtml: html,
        });
      } else if (coreEmailType) {
        response = await updateCoreTemplate(coreEmailType, {
          subject: templateData?.subject || "",
          message: html,
          design,
          bodyHtml: html,
          bodyText: localBodyText,
        });
      }

      toggleNotification({
        type: "success",
        title: translate("success"),
        message: translate("success.message"),
      });

      if (templateId === "new") navigate(`/plugins/${PLUGIN_ID}/design/${response?.id}`);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.response?.data?.error?.message;
      if (errorMessage) {
        toggleNotification({
          type: "danger",
          title: translate("error"),
          message: errorMessage,
        });
      } else {
        toggleNotification({
          type: "danger",
          title: translate("error"),
          message: errorMessage,
        });
      }
    }
  };

  const onLoadHandler = useCallback(() => {
    // ⬇︎ workaround to avoid firing onLoad api before setting the editor ref
    setTimeout(() => {
      if (templateData) emailEditorRef.current?.editor?.loadDesign(templateData.design);
    }, 500);
  }, []);

  const init = async () => {
    if (
      (!templateId && !coreEmailType) ||
      (coreEmailType && !["user-address-confirmation", "reset-password"].includes(coreEmailType)) ||
      templateId === "new"
    )
      return;

    let _templateData: EmailTemplate = {};

    if (templateId) {
      _templateData = await getTemplateById(templateId);
    } else if (coreEmailType) {
      _templateData = await getCoreTemplate(coreEmailType);
    }

    if (coreEmailType && isEmpty(_templateData.design)) {
      let _message = _templateData.message || "";

      // eslint-disable-next-line no-useless-escape
      if (_templateData.message && _templateData.message.match(/\<body/)) {
        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(_message, "text/html");
        _message = parsedDocument.body.innerText;
      }

      _message = striptags(_message, ["a", "img", "strong", "b", "i", "%", "%="])
        // eslint-disable-next-line quotes
        .replace(/"/g, "'")
        .replace(/<%|&#x3C;%/g, "{{")
        .replace(/%>|%&#x3E;/g, "}}")
        .replace(/\n/g, "<br />");

      _templateData.design = JSON.parse(
        JSON.stringify(standardEmailRegistrationTemplate).replace("__PLACEHOLDER__", _message)
      );
    }

    setTemplateData(_templateData);
    setBodyText(_templateData.bodyText || "");
  };

  useEffect(() => {
    getFullEditorConfig().then((config) => {
      setEditorOptions(config);
      setServerConfigLoaded(true);
    });
    return () => {
      emailEditorRef.current?.editor?.destroy(); // release react-email-editor on unmount
    };
  }, []);

  useEffect(() => {
    init();
  }, [templateId, coreEmailType]);

  useEffect(() => {
    setTimeout(() => {
      if (emailEditorRef.current?.editor && templateData?.design) {
        emailEditorRef.current.editor.loadDesign(templateData.design);
        // set bodyText from the design
        emailEditorRef.current?.editor?.exportPlainText((data: any) => {
          setBodyText(data.text);
        });
      }
    }, 600);
  }, [templateData]);

  return (
    <Page.Main>
      <Page.Title>{translate("page.design.title")}</Page.Title>
      <DesignerContainer>
        <Header>
          <IconButton
            style={{ marginTop: "19px", padding: "10px" }}
            label={translate("goBack")}
            onClick={() => navigate({ pathname: getUrl() })}
          >
            <ArrowLeft />
          </IconButton>

          {!isCore && (
            <Box style={{ width: "100%", maxWidth: "150px" }}>
              <Field.Root required error={errorRefId}>
                <Field.Label>{translate("input.label.templateReferenceId")}</Field.Label>
                <Field.Input
                  onChange={(e: any) =>
                    setTemplateData((state) => ({
                      ...(state || ({} as any)),
                      templateReferenceId:
                        e.target.value === ""
                          ? ""
                          : isFinite(parseInt(e.target.value))
                            ? parseInt(e.target.value)
                            : (state?.templateReferenceId ?? ""),
                    }))
                  }
                  value={templateData?.templateReferenceId ?? ""}
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
                    : templateData?.name || ""
                }
                onChange={(e: any) => {
                  setTemplateData((state) => ({ ...state, name: e.target.value }));
                }}
                placeholder={translate("input.placeholder.templateName")}
              />
              <Field.Error />
            </Field.Root>
          </Box>
          <Box style={{ width: "100%" }}>
            <Field.Root required>
              <Field.Label>{translate("input.label.subject")}</Field.Label>
              <Field.Input
                onChange={(value: any) => {
                  setTemplateData((state) => ({ ...state, subject: value.target.value }));
                }}
                value={templateData?.subject || ""}
                placeholder={translate("input.placeholder.subject")}
              />
              <Field.Error />
            </Field.Root>
          </Box>
          <Box style={{ width: "100%", maxWidth: "100px" }}>
            <ImportSingleDesign emailEditorRef={emailEditorRef} />
          </Box>
          <Box style={{ width: "100%", maxWidth: "100px" }}>
            <Button onClick={() => saveDesign()} style={{ marginTop: "19px", height: "38px", width: "100%" }}>
              {translate("save")}
            </Button>
          </Box>
        </Header>
        <Box style={{ flex: 1, display: "flex", height: "calc(100dvh - 80px)" }}>
          <Tabs.Root
            value={mode}
            onValueChange={(selected: "html" | "text" | "history") => {
              setMode(selected);
              if (selected === "html") {
                init();
              } else if (selected === "text" && !bodyText && templateData?.bodyHtml) {
                // Generate text from HTML if bodyText is empty
                emailEditorRef.current?.editor?.exportHtml((data: any) => {
                  const tempDiv = document.createElement("div");
                  tempDiv.innerHTML = data.html;
                  setBodyText(tempDiv.textContent || tempDiv.innerText || "");
                });
              }
            }}
          >
            <Tabs.List aria-label="Switch between the html, text and history design">
              <Tabs.Trigger value="html">{translate("designer.tab.html")}</Tabs.Trigger>
              <Tabs.Trigger value="text">{translate("designer.tab.text")}</Tabs.Trigger>
              {!isCore && templateId !== "new" && (
                <Tabs.Trigger value="history">{translate("designer.tab.history")}</Tabs.Trigger>
              )}
            </Tabs.List>
            <Tabs.Content style={{ height: "calc(100vh - 160px)" }} value="html">
              <Box
                style={{
                  minHeight: "540px",
                  height: "100%",
                }}
              >
                {serverConfigLoaded && (
                  <StrictMode>
                    <EmailEditor
                      options={editorOptions}
                      minHeight="100%"
                      ref={emailEditorRef}
                      onLoad={onLoadHandler}
                    />
                  </StrictMode>
                )}
              </Box>
            </Tabs.Content>
            <Tabs.Content style={{ height: "calc(100vh - 160px)", padding: "20px" }} value="text">
              <Textarea
                onChange={(e: any) => setBodyText(e.target.value)}
                value={bodyText}
                style={{ resize: "vertical" }}
              />
            </Tabs.Content>
            {!isCore && templateId !== "new" && (
              <Tabs.Content style={{ height: "calc(100vh - 160px)", overflow: "auto" }} value="history">
                <VersionHistoryTab
                  templateId={templateId || ""}
                  onVersionRestore={() => {
                    init();
                  }}
                />
              </Tabs.Content>
            )}
          </Tabs.Root>
        </Box>
      </DesignerContainer>
    </Page.Main>
  );
};

export default memo(Designer, shallowIsEqual);
