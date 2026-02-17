import { Layouts, Page, useNotification } from "@strapi/admin/strapi-admin";
import { Box, Button, Divider, Searchbar, SearchForm, Tabs, Tooltip } from "@strapi/design-system";
import { useCallback, useEffect, useState } from "react";
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
  const [searchResults, setSearchResults] = useState<EmailTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("customEmailTemplates");
  const { toggleNotification } = useNotification();

  const init = useCallback(async (search?: string) => {
    const data = await getTemplatesData(search);
    setEmailTemplates(data);
    setSearchResults(data);
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

  const handleSearch = useCallback(async (value: string) => {
    setSearchTerm(value);

    if (value.trim().length === 0) {
      // If search is empty, reload all templates
      const data = await getTemplatesData();
      setSearchResults(data);
    } else {
      // Fetch filtered results from backend
      const data = await getTemplatesData(value);
      setSearchResults(data);
    }
  }, []);

  const handleClearSearch = useCallback(async () => {
    setSearchTerm("");
    const data = await getTemplatesData();
    setSearchResults(data);
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
            if (selected !== "customEmailTemplates") {
              handleClearSearch();
            }
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
            <Box padding={3} style={{ maxWidth: "400px", width: "100%" }}>
              <SearchForm>
                <Searchbar
                  name="templateSearch"
                  onClear={handleClearSearch}
                  value={searchTerm}
                  placeholder={translate("search.placeholder") || "Search templates by name..."}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
                />
              </SearchForm>
            </Box>
            <CustomEmailTable reload={init} data={searchResults} />
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
