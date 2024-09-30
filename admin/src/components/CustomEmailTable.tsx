import {
  Box,
  Button,
  Dialog,
  EmptyStateLayout,
  Flex,
  IconButton,
  Table,
  Tbody,
  Td,
  TFooter,
  Th,
  Thead,
  Tr,
  Typography,
  VisuallyHidden,
} from "@strapi/design-system";
import { Duplicate, Pencil, Plus, Trash } from "@strapi/icons";
import { EmptyPictures } from "@strapi/icons/symbols";
import { useNotification } from "@strapi/strapi/admin";
import dayjs from "dayjs";
import { useCallback, useRef, useState } from "react";
import { FaHashtag } from "react-icons/fa6";
import { LuCopyCheck } from "react-icons/lu";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { getUrl } from "../constants";
import { deleteTemplate, duplicateTemplate, getTemplatesData } from "../services";
import type { EmailTemplate } from "../types";
import { getTranslation } from "../utils/getTranslation";
import ImportExportActions from "./ImportExportActions";

const CustomEmailTable = ({ data = [], reload }: { data: EmailTemplate[]; reload: Function }) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { toggleNotification } = useNotification();
  const emailTemplatesFileSelect = useRef<HTMLInputElement>(null);

  // State of duplicate modal
  const [duplicateConfirmationModal, setDuplicateConfirmationModal] = useState(false);
  // Store the id of the template to duplicate
  const [duplicateId, setDuplicateId] = useState();
  const [deleteId, setDeleteId] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /**
   * Handle the duplication of a template
   *
   * Redirects to the duplicated template
   */
  const handleTemplateDuplication = useCallback(async () => {
    if (!duplicateId) return;
    try {
      const response = await duplicateTemplate(duplicateId);
      toggleNotification({
        type: "success",
        title: formatMessage({ id: getTranslation("success") }),
        message: formatMessage({ id: getTranslation("success.duplicate") }),
      });
      navigate({ pathname: getUrl(`design/${response.id}`) });
    } catch (error) {
      toggleNotification({
        type: "danger",
        title: formatMessage({ id: getTranslation("error") }),
        message: formatMessage({ id: getTranslation("error.duplicate") }),
      });
    }
  }, [duplicateConfirmationModal]);

  /**
   * Handle the deletion of a template
   */
  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    try {
      await deleteTemplate(deleteId);
      await reload();
      toggleNotification({
        type: "success",
        title: formatMessage({ id: getTranslation("success") }),
        message: formatMessage({ id: getTranslation("success.delete") }),
      });
    } catch (error) {
      toggleNotification({
        type: "danger",
        title: formatMessage({ id: getTranslation("error") }),
        message: formatMessage({ id: getTranslation("error.delete") }),
      });
    }
  }, [deleteId]);

  const handleTemplatesExport = async () => {
    const templates = await getTemplatesData();

    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(templates))}`;
    let a = document.createElement("a");
    a.href = dataStr;
    a.download = `email_templates_${dayjs().unix()}.json`;
    a.click();
  };

  const emailTemplatesHeaders = [
    { name: formatMessage({ id: getTranslation("table.header.name") }), value: "name" },
    {
      name: formatMessage({ id: getTranslation("table.header.templateReferenceId") }),
      value: "templateReferenceId",
    },
    { name: formatMessage({ id: getTranslation("table.header.createdAt") }), value: "createdAt" },
  ];
  if (data.length === 0) {
    return (
      <Box padding={8}>
        <EmptyStateLayout
          shadow="none"
          icon={<EmptyPictures width="210px" />}
          content={formatMessage({ id: getTranslation("customTable.noDesigns") })}
          action={
            <Button
              variant="secondary"
              startIcon={<Plus />}
              onClick={() => navigate({ pathname: getUrl(`design/new`) })}
            >
              {formatMessage({ id: getTranslation("customTable.addDesign") })}
            </Button>
          }
        />

        <ImportExportActions data={data} reload={reload} handleTemplatesExport={handleTemplatesExport} />
      </Box>
    );
  }
  return (
    <>
      <Dialog.Root
        open={duplicateConfirmationModal}
        onOpenChange={() => setDuplicateConfirmationModal((s: boolean) => !s)}
      >
        <Dialog.Content>
          <Dialog.Header>{formatMessage({ id: getTranslation("confirm.title") })}</Dialog.Header>
          <Dialog.Body icon={<LuCopyCheck size="30px" />}>
            {formatMessage({ id: getTranslation("confirm.duplicate.message") })}
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Cancel>
              <Button onClick={() => setDuplicateId(undefined)} fullWidth variant="tertiary">
                Cancel
              </Button>
            </Dialog.Cancel>
            <Dialog.Action>
              <Button onClick={() => handleTemplateDuplication()} fullWidth variant="success-light">
                Yes, duplicate
              </Button>
            </Dialog.Action>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={showDeleteModal} onOpenChange={() => setShowDeleteModal((s: boolean) => !s)}>
        <Dialog.Content>
          <Dialog.Header>{formatMessage({ id: getTranslation("confirm.title") })}</Dialog.Header>
          <Dialog.Body icon={<Trash width="30px" />}>
            {formatMessage({ id: getTranslation("confirm.delete.message") })}
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Cancel>
              <Button onClick={() => setDeleteId(undefined)} fullWidth variant="tertiary">
                Cancel
              </Button>
            </Dialog.Cancel>
            <Dialog.Action>
              <Button onClick={() => handleDelete()} fullWidth variant="danger-light">
                Yes, delete
              </Button>
            </Dialog.Action>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      <Box padding={3}>
        <Table
          colCount={emailTemplatesHeaders.length + 1}
          rowCount={data.length}
          footer={
            <TFooter
              style={{ cursor: "pointer" }}
              icon={<Plus />}
              onClick={() => navigate({ pathname: getUrl(`design/new`) })}
            >
              {formatMessage({ id: getTranslation("customTable.addDesign") })}
            </TFooter>
          }
        >
          <Thead>
            <Tr>
              {emailTemplatesHeaders.map((header) => (
                <Th key={header.name}>
                  <Typography style={{ fontWeight: "bold" }} variant="sigma">
                    {header.name}
                  </Typography>
                </Th>
              ))}
              <Th>
                <VisuallyHidden>Actions</VisuallyHidden>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((entry, idx) => (
              <Tr key={idx}>
                <Td>
                  <Typography style={{ fontWeight: "bold" }} textColor="neutral800">
                    {entry.name}
                  </Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{entry.templateReferenceId}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{entry.createdAt}</Typography>
                </Td>

                <Td>
                  <Flex gap="10px" justifyContent="end">
                    <IconButton
                      label={formatMessage({ id: getTranslation("tooltip.edit") })}
                      onClick={() => navigate({ pathname: getUrl(`design/${entry.id}`) })}
                    >
                      <Pencil />
                    </IconButton>

                    <IconButton
                      label={formatMessage({ id: getTranslation("tooltip.duplicate") })}
                      onClick={() => {
                        setDuplicateId(entry.id);
                        setDuplicateConfirmationModal(true);
                      }}
                    >
                      <Duplicate />
                    </IconButton>

                    <IconButton
                      label={formatMessage({ id: getTranslation("tooltip.copyTemplateId") })}
                      onClick={() => {
                        navigator.clipboard.writeText(`${entry.templateReferenceId}`).then(
                          () => {
                            toggleNotification({
                              type: "success",
                              title: formatMessage({ id: getTranslation("success") }),
                              message: formatMessage({ id: getTranslation("success.copyTemplateId") }),
                            });
                          },
                          (err) => {
                            console.error("Could not copy text: ", err);
                          }
                        );
                      }}
                    >
                      <FaHashtag size={16} />
                    </IconButton>

                    <Box paddingLeft={1}>
                      <IconButton
                        label={formatMessage({ id: getTranslation("tooltip.delete") })}
                        onClick={() => {
                          setDeleteId(entry.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <Trash />
                      </IconButton>
                    </Box>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <ImportExportActions data={data} reload={reload} handleTemplatesExport={handleTemplatesExport} />
      </Box>
    </>
  );
};

export default CustomEmailTable;
