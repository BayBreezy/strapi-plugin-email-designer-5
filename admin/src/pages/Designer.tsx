import { Page } from "@strapi/admin/strapi-admin";
import { useNotification } from "@strapi/strapi/admin";
import { isEmpty } from "lodash";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { EditorRef } from "react-email-editor";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import striptags from "striptags";
import styled from "styled-components";
import DesignerHeader from "../components/Designer/DesignerHeader";
import DesignerTabsContainer from "../components/Designer/DesignerTabsContainer";
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
import { EmailTemplate } from "../types";
import { shallowIsEqual } from "../utils/helpers";

const DesignerContainer = styled.div`
  padding: 18px 30px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Designer = ({ isCore = false }: { isCore?: boolean }) => {
  const emailEditorRef = useRef<EditorRef>(null);
  const navigate = useNavigate();
  const translate = useTr();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleNotification } = useNotification();

  const { templateId, coreEmailType } = useParams();
  const [templateData, setTemplateData] = useState<EmailTemplate>();
  const [errorRefId, setErrorRefId] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [mode, setMode] = useState<"html" | "text" | "history">(() => {
    const tabParam = searchParams.get("tab");
    return (tabParam as "html" | "text" | "history") || "html";
  });
  const [serverConfigLoaded, setServerConfigLoaded] = useState(false);
  const [editorOptions, setEditorOptions] = useState<any>();

  const saveDesign = async () => {
    if (!coreEmailType && !templateData?.templateReferenceId) {
      toggleNotification({
        type: "danger",
        title: translate("error.noReferenceId.title"),
        message: translate("error.noReferenceId.message"),
      });
      setErrorRefId("Required");
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
      }
    }
  };

  const onLoadHandler = useCallback(() => {
    setTimeout(() => {
      if (templateData) emailEditorRef.current?.editor?.loadDesign(templateData.design);
    }, 500);
  }, [templateData]);

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

      if (_templateData.message && _templateData.message.match(/\<body/)) {
        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(_message, "text/html");
        _message = parsedDocument.body.innerText;
      }

      _message = striptags(_message, ["a", "img", "strong", "b", "i", "%", "%="])
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
      emailEditorRef.current?.editor?.destroy();
    };
  }, []);

  useEffect(() => {
    init();
  }, [templateId, coreEmailType]);

  useEffect(() => {
    setTimeout(() => {
      if (emailEditorRef.current?.editor && templateData?.design) {
        emailEditorRef.current.editor.loadDesign(templateData.design);
        emailEditorRef.current?.editor?.exportPlainText((data: any) => {
          setBodyText(data.text);
        });
      }
    }, 600);
  }, [templateData]);

  const handleTabChange = (selected: "html" | "text" | "history") => {
    setMode(selected);
    setSearchParams({ tab: selected });
    if (selected === "html") {
      init();
    }
  };

  return (
    <Page.Main>
      <Page.Title>{translate("page.design.title")}</Page.Title>
      <DesignerContainer>
        <DesignerHeader
          isCore={isCore}
          coreEmailType={coreEmailType}
          templateReferenceId={templateData?.templateReferenceId}
          templateName={templateData?.name}
          subject={templateData?.subject}
          bodyText={bodyText}
          mode={mode}
          errorRefId={errorRefId}
          emailEditorRef={emailEditorRef}
          onTemplateReferenceIdChange={(value: any) =>
            setTemplateData((state) => ({
              ...(state || ({} as any)),
              templateReferenceId:
                value === ""
                  ? ""
                  : isFinite(parseInt(value))
                    ? parseInt(value)
                    : (state?.templateReferenceId ?? ""),
            }))
          }
          onTemplateNameChange={(value: string) => setTemplateData((state) => ({ ...state, name: value }))}
          onSubjectChange={(value: string) => setTemplateData((state) => ({ ...state, subject: value }))}
          onSave={saveDesign}
          onGoBack={() => navigate({ pathname: getUrl() })}
        />

        <DesignerTabsContainer
          mode={mode}
          isCore={isCore}
          templateId={templateId}
          templateData={templateData}
          bodyText={bodyText}
          emailEditorRef={emailEditorRef}
          editorOptions={editorOptions}
          serverConfigLoaded={serverConfigLoaded}
          onModeChange={handleTabChange}
          onBodyTextChange={setBodyText}
          onHTMLEditorLoad={onLoadHandler}
          onVersionRestore={init}
        />
      </DesignerContainer>
    </Page.Main>
  );
};

export default memo(Designer, shallowIsEqual);
