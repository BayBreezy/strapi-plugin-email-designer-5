import { Button, Dialog } from "@strapi/design-system";
import { CloudUpload } from "@strapi/icons";
import { useNotification } from "@strapi/strapi/admin";
import destr from "destr";
import React, { useRef, useState } from "react";
import { EditorRef } from "react-email-editor";
import { useTr } from "../hooks/useTr";

type ImportSingleDesignProps = {
  emailEditorRef: React.RefObject<EditorRef>;
};
const ImportSingleDesign = ({ emailEditorRef }: ImportSingleDesignProps) => {
  const translate = useTr();
  const { toggleNotification } = useNotification();
  const hiddenInput = useRef<HTMLInputElement>(null);
  // State used to show the modal
  const [showModal, setShowModal] = useState(false);
  // State used to store the uploaded design
  const [template, setTemplate] = useState<any>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Check if the event is empty
    if (!event) return;
    // Get the files from the event
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    // Check if the file is empty
    if (!file) return;

    const fr = new FileReader();
    fr.onload = async () => {
      setTemplate(destr(fr.result));
      setShowModal(true);
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
      <Button
        startIcon={<CloudUpload />}
        onClick={() => hiddenInput.current?.click()}
        style={{ marginTop: "19px", height: "38px", width: "100%" }}
        variant="tertiary"
      >
        {translate("import")}
      </Button>
      <Dialog.Root
        open={showModal}
        onOpenChange={() => {
          setShowModal((s: boolean) => !s);
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
              <Button onClick={() => handleLoadSingleDesign()} fullWidth variant="success-light">
                {translate("confirm")}
              </Button>
            </Dialog.Action>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default ImportSingleDesign;
