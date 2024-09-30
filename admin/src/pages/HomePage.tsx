import { Layouts, Page, useNotification } from "@strapi/admin/strapi-admin";
import { Button, Divider, Tabs, Tooltip } from "@strapi/design-system";
import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import CoreEmailTable from "../components/CoreEmailTable";
import CustomEmailTable from "../components/CustomEmailTable";
import { getUrl } from "../constants";
import { useTr } from "../hooks/useTr";
import { getTemplatesData } from "../services";
import type { EmailTemplate } from "../types";

const HomePage = () => {
  const navigate = useNavigate();
  const translate = useTr();
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [activeTab, setActiveTab] = useState("customEmailTemplates");
  const { toggleNotification } = useNotification();

  const init = useCallback(async () => {
    const data = await getTemplatesData();
    setEmailTemplates(data);
  }, []);

  useEffect(() => {
    init().catch(() => {
      toggleNotification({
        type: "danger",
        title: translate("error"),
        message: translate("error.loadingTemplates"),
      });
    });
  }, []);

  return (
    <Page.Main>
      <Page.Title>{translate("page.title")}</Page.Title>
      <Layouts.Header
        id="title"
        title={translate("page.title")}
        subtitle={translate("page.subTitle")}
        primaryAction={
          <Tooltip label={translate("page.home.cta.tooltip")}>
            <Button onClick={() => navigate({ pathname: getUrl(`design/new`) })}>
              {translate("page.home.cta")}
            </Button>
          </Tooltip>
        }
      />

      <Layouts.Content>
        <Divider style={{ marginBottom: "50px" }} />

        <Tabs.Root
          value={activeTab}
          onValueChange={(selected: string) => {
            setActiveTab(selected);
          }}
        >
          <Tabs.List aria-label="Switch between custom email designs & core email designs">
            <Tabs.Trigger value="customEmailTemplates">
              {translate("emailTypes.custom.tab.label")}
            </Tabs.Trigger>
            <Tabs.Trigger value="coreEmailTemplates">{translate("emailTypes.core.tab.label")}</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content
            style={{ borderBottomRightRadius: "6px", borderBottomLeftRadius: "6px" }}
            value="customEmailTemplates"
          >
            <CustomEmailTable reload={init} data={emailTemplates} />
          </Tabs.Content>
          <Tabs.Content
            style={{ borderBottomRightRadius: "6px", borderBottomLeftRadius: "6px" }}
            value="coreEmailTemplates"
          >
            <CoreEmailTable />
          </Tabs.Content>
        </Tabs.Root>
        <div style={{ paddingBottom: "20px" }}></div>
      </Layouts.Content>
    </Page.Main>
  );
};

export { HomePage };
