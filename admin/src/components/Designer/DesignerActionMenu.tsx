import { Button, Dialog, IconButton, MenuItem, SimpleMenu } from "@strapi/design-system";
import { More, PaperPlane, Upload } from "@strapi/icons";
import { useNotification } from "@strapi/strapi/admin";
import destr from "destr";
import { useRef, useState } from "react";
import { EditorRef } from "react-email-editor";
import { useTr } from "../../hooks/useTr";
import TestSendModal from "./TestSendModal";

interface DesignerActionMenuProps {
  emailEditorRef: React.RefObject<EditorRef>;
  subject?: string;
  bodyText?: string;
}

const DesignerActionMenu = ({ emailEditorRef, subject, bodyText }: DesignerActionMenuProps) => {
  const translate = useTr();
  const { toggleNotification } = useNotification();
  const hiddenInput = useRef<HTMLInputElement>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [template, setTemplate] = useState<any>();
  const [showTestSendModal, setShowTestSendModal] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event) return;
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file) return;

    const fr = new FileReader();
    fr.onload = async () => {
      setTemplate(destr(fr.result));
      setShowImportModal(true);
      if (hiddenInput.current) hiddenInput.current.value = "";
    };
    fr.readAsText(file);
  };

  const handleLoadSingleDesign = () => {
    if (emailEditorRef?.current) {
      try {
        emailEditorRef.current?.editor?.loadDesign(template);
        toggleNotification({
          type: "success",
          title: translate("success"),
          message: translate("success.single.message"),
        });
      } catch (error: any) {
        toggleNotification({
          type: "danger",
          title: translate("error"),
          message: error.message,
        });
      }
    }
  };

  return (
    <>
      <input
        type="file"
        multiple={false}
        onChange={handleFileChange}
        accept=".json"
        hidden
        ref={hiddenInput}
      />

      <SimpleMenu
        label={translate("actions")}
        size="L"
        tag={IconButton}
        icon={<More />}
        popoverPlacement="bottom-end"
      >
        <MenuItem
          startIcon={<Upload />}
          onSelect={() => {
            hiddenInput.current?.click();
          }}
        >
          {translate("import")}
        </MenuItem>
        <MenuItem
          startIcon={<PaperPlane />}
          onSelect={() => {
            setShowTestSendModal(true);
          }}
        >
          {translate("testSend.action")}
        </MenuItem>
      </SimpleMenu>

      <Dialog.Root
        open={showImportModal}
        onOpenChange={() => {
          setShowImportModal((s: boolean) => !s);
        }}
      >
        <Dialog.Content>
          <Dialog.Header>{translate("confirm.title")}</Dialog.Header>
          <Dialog.Body>{translate("confirm.singleImport")}</Dialog.Body>
          <Dialog.Footer>
            <Dialog.Cancel>
              <Button fullWidth variant="tertiary">
                {translate("cancel")}
              </Button>
            </Dialog.Cancel>
            <Dialog.Action>
              <Button onClick={handleLoadSingleDesign} fullWidth variant="success-light">
                {translate("confirm")}
              </Button>
            </Dialog.Action>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      <TestSendModal
        isOpen={showTestSendModal}
        onClose={() => setShowTestSendModal(false)}
        emailEditorRef={emailEditorRef}
        subject={subject}
        bodyText={bodyText}
      />
    </>
  );
};

export default DesignerActionMenu;
