import {
  Box,
  Button,
  Dialog,
  EmptyStateLayout,
  IconButton,
  MenuItem,
  SimpleMenu,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
  VisuallyHidden,
} from "@strapi/design-system";
import { ArrowsCounterClockwise, More, SquaresFour, Trash } from "@strapi/icons";
import { useNotification } from "@strapi/strapi/admin";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import {
  deleteTemplateVersion,
  getTemplateById,
  getVersionHistory,
  restoreTemplateVersion,
} from "../services";
import { Version } from "../types";
import { getTranslation } from "../utils/getTranslation";
import VersionCompareModal from "./VersionCompareModal";

interface VersionHistoryTabProps {
  templateId: string;
  onVersionRestore: () => void;
}

const VersionHistoryTab = ({ templateId, onVersionRestore }: VersionHistoryTabProps) => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoreConfirmation, setRestoreConfirmation] = useState(false);
  const [restoreVersionId, setRestoreVersionId] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteVersionId, setDeleteVersionId] = useState<string | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareVersionId, setCompareVersionId] = useState<string | null>(null);
  const [currentTemplate, setCurrentTemplate] = useState<Version | null>(null);

  const loadVersions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getVersionHistory(templateId);
      setVersions(data);
      // Load current template for comparison
      const template = await getTemplateById(templateId);
      setCurrentTemplate({
        id: template.id,
        versionNumber: 0, // Current version
        changedBy: "current",
        changesSummary: { changed: [] },
        createdAt: template.updatedAt || template.createdAt || "",
        design: template.design,
        bodyHtml: template.bodyHtml,
        bodyText: template.bodyText,
        subject: template.subject,
        name: template.name,
      });
    } catch (error) {
      toggleNotification({
        type: "danger",
        title: formatMessage({ id: getTranslation("error") }),
        message: formatMessage({ id: getTranslation("error.loadingVersions") }),
      });
    } finally {
      setLoading(false);
    }
  }, [templateId, formatMessage, toggleNotification]);

  useEffect(() => {
    loadVersions();
  }, [loadVersions]);

  const handleRestoreVersion = useCallback(async () => {
    if (!restoreVersionId) return;

    try {
      await restoreTemplateVersion(templateId, restoreVersionId);
      toggleNotification({
        type: "success",
        title: formatMessage({ id: getTranslation("success") }),
        message: formatMessage({ id: getTranslation("success.versionRestored") }),
      });
      setRestoreConfirmation(false);
      setRestoreVersionId(null);
      onVersionRestore();
      await loadVersions();
    } catch (error) {
      toggleNotification({
        type: "danger",
        title: formatMessage({ id: getTranslation("error") }),
        message: formatMessage({ id: getTranslation("error.restoreVersion") }),
      });
    }
  }, [restoreVersionId, templateId, formatMessage, toggleNotification, onVersionRestore, loadVersions]);

  const handleDeleteVersion = useCallback(async () => {
    if (!deleteVersionId) return;

    try {
      await deleteTemplateVersion(templateId, deleteVersionId);
      toggleNotification({
        type: "success",
        title: formatMessage({ id: getTranslation("success") }),
        message: formatMessage({ id: getTranslation("success.versionDeleted") }),
      });
      setDeleteConfirmation(false);
      setDeleteVersionId(null);
      await loadVersions();
    } catch (error) {
      toggleNotification({
        type: "danger",
        title: formatMessage({ id: getTranslation("error") }),
        message: formatMessage({ id: getTranslation("error.deleteVersion") }),
      });
    }
  }, [deleteVersionId, templateId, formatMessage, toggleNotification, loadVersions]);

  const handleCompare = useCallback((versionId: string) => {
    setCompareVersionId(versionId);
    setCompareModalOpen(true);
  }, []);

  const selectedVersion = compareVersionId ? versions.find((v) => v.id === compareVersionId) : null;

  if (loading) {
    return (
      <Box padding={3}>
        <Typography>{formatMessage({ id: getTranslation("loading") })}</Typography>
      </Box>
    );
  }

  if (versions.length === 0) {
    return (
      <Box padding={8}>
        <EmptyStateLayout
          shadow="none"
          content={formatMessage({ id: getTranslation("versionHistory.noVersions") })}
        />
      </Box>
    );
  }

  return (
    <>
      <Dialog.Root open={restoreConfirmation} onOpenChange={() => setRestoreConfirmation((s) => !s)}>
        <Dialog.Content>
          <Dialog.Header>{formatMessage({ id: getTranslation("confirm.title") })}</Dialog.Header>
          <Dialog.Body>{formatMessage({ id: getTranslation("confirm.restoreVersion.message") })}</Dialog.Body>
          <Dialog.Footer>
            <Dialog.Cancel>
              <Button
                onClick={() => {
                  setRestoreVersionId(null);
                }}
                fullWidth
                variant="tertiary"
              >
                Cancel
              </Button>
            </Dialog.Cancel>
            <Dialog.Action>
              <Button onClick={() => handleRestoreVersion()} fullWidth variant="success-light">
                Yes, restore
              </Button>
            </Dialog.Action>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={deleteConfirmation} onOpenChange={() => setDeleteConfirmation((s) => !s)}>
        <Dialog.Content>
          <Dialog.Header>{formatMessage({ id: getTranslation("confirm.title") })}</Dialog.Header>
          <Dialog.Body>{formatMessage({ id: getTranslation("confirm.deleteVersion.message") })}</Dialog.Body>
          <Dialog.Footer>
            <Dialog.Cancel>
              <Button
                onClick={() => {
                  setDeleteVersionId(null);
                }}
                fullWidth
                variant="tertiary"
              >
                Cancel
              </Button>
            </Dialog.Cancel>
            <Dialog.Action>
              <Button onClick={() => handleDeleteVersion()} fullWidth variant="danger-light">
                Yes, delete
              </Button>
            </Dialog.Action>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      <Box padding={3}>
        <Table colCount={5} rowCount={versions.length}>
          <Thead>
            <Tr>
              <Th>
                <Typography style={{ fontWeight: "bold" }} variant="sigma">
                  Version
                </Typography>
              </Th>
              <Th>
                <Typography style={{ fontWeight: "bold" }} variant="sigma">
                  Changed Fields
                </Typography>
              </Th>
              <Th>
                <Typography style={{ fontWeight: "bold" }} variant="sigma">
                  Changed By
                </Typography>
              </Th>
              <Th>
                <Typography style={{ fontWeight: "bold" }} variant="sigma">
                  Date
                </Typography>
              </Th>
              <Th>
                <VisuallyHidden>Actions</VisuallyHidden>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {versions.map((version) => (
              <Tr key={version.id}>
                <Td>
                  <Typography textColor="neutral800">#{version.versionNumber}</Typography>
                </Td>
                <Td>
                  {/* Check if it was restored from prev version */}
                  {"restored" in version.changesSummary && version.changesSummary.restored ? (
                    <Typography textColor="neutral800" size="S">
                      Restored from version {version.changesSummary.restoredFromVersion}
                    </Typography>
                  ) : (
                    <Typography textColor="neutral800" size="S">
                      {"changed" in version.changesSummary
                        ? version.changesSummary.changed?.join(", ") || "-"
                        : "-"}
                    </Typography>
                  )}
                </Td>
                <Td>
                  <Typography textColor="neutral800">{version.changedBy || "Unknown"}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    {dayjs(version.createdAt).format("MMM DD, YYYY [at] h:mmA")}
                  </Typography>
                </Td>
                <Td>
                  <SimpleMenu
                    label={formatMessage({ id: getTranslation("actions") })}
                    tag={IconButton}
                    icon={<More />}
                    popoverPlacement="bottom-end"
                  >
                    <MenuItem startIcon={<SquaresFour />} onSelect={() => handleCompare(version.id)}>
                      {formatMessage({ id: getTranslation("tooltip.compare") })}
                    </MenuItem>
                    <MenuItem
                      startIcon={<ArrowsCounterClockwise />}
                      onSelect={() => {
                        setRestoreVersionId(version.id);
                        setRestoreConfirmation(true);
                      }}
                    >
                      {formatMessage({ id: getTranslation("tooltip.restore") })}
                    </MenuItem>
                    <MenuItem
                      startIcon={<Trash />}
                      variant="danger"
                      onSelect={() => {
                        setDeleteVersionId(version.id);
                        setDeleteConfirmation(true);
                      }}
                    >
                      {formatMessage({ id: getTranslation("tooltip.version.delete") })}
                    </MenuItem>
                  </SimpleMenu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <VersionCompareModal
        isOpen={compareModalOpen}
        onClose={() => {
          setCompareModalOpen(false);
          setCompareVersionId(null);
        }}
        oldVersion={selectedVersion}
        newVersion={currentTemplate}
      />
    </>
  );
};

export default VersionHistoryTab;
