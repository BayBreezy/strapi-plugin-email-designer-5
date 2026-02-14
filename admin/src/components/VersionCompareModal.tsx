import { Box, Modal, Tabs } from "@strapi/design-system";
import { useState } from "react";
import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";
import { useIntl } from "react-intl";
import { Version } from "../types";
import { getTranslation } from "../utils/getTranslation";

interface VersionCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldVersion?: Version | null;
  newVersion?: Version | null;
}

const VersionCompareModal = ({ isOpen, onClose, oldVersion, newVersion }: VersionCompareModalProps) => {
  const { formatMessage } = useIntl();
  const [activeTab, setActiveTab] = useState("design");

  if (!oldVersion || !newVersion) return null;

  const getFieldValue = (version: Version, field: string) => {
    switch (field) {
      case "design":
        return version.design || {};
      case "bodyHtml":
        return version.bodyHtml || "";
      case "bodyText":
        return version.bodyText || "";
      case "subject":
        return version.subject || "";
      case "name":
        return version.name || "";
      default:
        return "";
    }
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={onClose}>
      <Modal.Content
        style={{
          minWidth: "90vw",
          maxWidth: "90vw",
          minHeight: "80vh",
          maxHeight: "80vh",
        }}
      >
        <Modal.Header>
          <Modal.Title>
            {formatMessage({ id: getTranslation("versionCompare.title") })}{" "}
            <em>(v{oldVersion.versionNumber})</em>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List aria-label="Compare different fields">
              <Tabs.Trigger value="design">
                {formatMessage({ id: getTranslation("versionCompare.tab.design") })}
              </Tabs.Trigger>
              <Tabs.Trigger value="bodyHtml">
                {formatMessage({ id: getTranslation("versionCompare.tab.html") })}
              </Tabs.Trigger>
              <Tabs.Trigger value="bodyText">
                {formatMessage({ id: getTranslation("versionCompare.tab.text") })}
              </Tabs.Trigger>
              <Tabs.Trigger value="subject">
                {formatMessage({ id: getTranslation("versionCompare.tab.subject") })}
              </Tabs.Trigger>
              <Tabs.Trigger value="name">
                {formatMessage({ id: getTranslation("versionCompare.tab.name") })}
              </Tabs.Trigger>
            </Tabs.List>

            <Box style={{ overflow: "auto" }}>
              <Tabs.Content value="design">
                <ReactDiffViewer
                  oldValue={getFieldValue(oldVersion, "design")}
                  newValue={getFieldValue(newVersion, "design")}
                  splitView
                  useDarkTheme
                  leftTitle={`Version ${oldVersion.versionNumber}`}
                  rightTitle="Current Version"
                  summary="Design changes"
                  compareMethod={DiffMethod.JSON}
                  showDiffOnly
                />
              </Tabs.Content>

              <Tabs.Content value="bodyHtml">
                <ReactDiffViewer
                  oldValue={getFieldValue(oldVersion, "bodyHtml")}
                  newValue={getFieldValue(newVersion, "bodyHtml")}
                  splitView
                  useDarkTheme
                  leftTitle={`Version ${oldVersion.versionNumber}`}
                  compareMethod={DiffMethod.WORDS}
                  rightTitle="Current Version"
                  summary="HTML changes"
                  showDiffOnly
                />
              </Tabs.Content>

              <Tabs.Content value="bodyText">
                <ReactDiffViewer
                  oldValue={getFieldValue(oldVersion, "bodyText")}
                  newValue={getFieldValue(newVersion, "bodyText")}
                  splitView
                  useDarkTheme
                  leftTitle={`Version ${oldVersion.versionNumber}`}
                  compareMethod={DiffMethod.WORDS}
                  rightTitle="Current Version"
                  summary="Text changes"
                  showDiffOnly
                />
              </Tabs.Content>

              <Tabs.Content value="subject">
                <ReactDiffViewer
                  oldValue={getFieldValue(oldVersion, "subject")}
                  newValue={getFieldValue(newVersion, "subject")}
                  splitView
                  useDarkTheme
                  leftTitle={`Version ${oldVersion.versionNumber}`}
                  rightTitle="Current Version"
                  compareMethod={DiffMethod.WORDS}
                  summary="Subject changes"
                  showDiffOnly={false}
                />
              </Tabs.Content>

              <Tabs.Content value="name">
                <ReactDiffViewer
                  oldValue={getFieldValue(oldVersion, "name")}
                  newValue={getFieldValue(newVersion, "name")}
                  splitView
                  useDarkTheme
                  leftTitle={`Version ${oldVersion.versionNumber}`}
                  rightTitle="Current Version"
                  compareMethod={DiffMethod.WORDS}
                  summary="Name changes"
                  showDiffOnly={false}
                />
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default VersionCompareModal;
