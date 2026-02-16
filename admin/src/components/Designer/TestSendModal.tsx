import { Box, Button, Dialog, Field, Textarea, Typography } from "@strapi/design-system";
import { useNotification } from "@strapi/strapi/admin";
import { useEffect, useState } from "react";
import { EditorRef } from "react-email-editor";
import * as yup from "yup";
import { useTr } from "../../hooks/useTr";
import { getEmailProviderStatus, getSampleEmailData, sendTestEmail } from "../../services";

interface TestSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailEditorRef: React.RefObject<EditorRef>;
  subject?: string;
  bodyText?: string;
}

const testSendSchema = yup.object().shape({
  toEmail: yup.string().email("Invalid email address").required("Recipient email is required"),
  dataJson: yup.string().test("is-valid-json", "Invalid JSON format", (value) => {
    if (!value || value.trim() === "") return true;
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }),
});

const TestSendModal = ({ isOpen, onClose, emailEditorRef, subject, bodyText }: TestSendModalProps) => {
  const translate = useTr();
  const { toggleNotification } = useNotification();
  const [toEmail, setToEmail] = useState("");
  const [dataJson, setDataJson] = useState("");
  const [sending, setSending] = useState(false);
  const [checkingConfig, setCheckingConfig] = useState(false);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<{ toEmail?: string; dataJson?: string }>({});

  useEffect(() => {
    if (!isOpen) return;

    setCheckingConfig(true);
    getEmailProviderStatus()
      .then((result) => {
        setIsConfigured(result.configured);
      })
      .catch(() => {
        setIsConfigured(false);
      })
      .finally(() => {
        setCheckingConfig(false);
      });
  }, [isOpen]);

  useEffect(() => {
    // Validate on change
    const validate = async () => {
      try {
        await testSendSchema.validate({ toEmail, dataJson }, { abortEarly: false });
        setErrors({});
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          const validationErrors: { toEmail?: string; dataJson?: string } = {};
          error.inner.forEach((err) => {
            if (err.path) {
              validationErrors[err.path as keyof typeof validationErrors] = err.message;
            }
          });
          setErrors(validationErrors);
        }
      }
    };

    validate();
  }, [toEmail, dataJson]);

  const parseData = () => {
    if (!dataJson.trim()) return {};
    return JSON.parse(dataJson);
  };

  const handleLoadSampleData = async (type: "reset-password" | "email-confirmation") => {
    try {
      const sampleData = await getSampleEmailData(type);
      setDataJson(JSON.stringify(sampleData, null, 2));
    } catch (error) {
      toggleNotification({
        type: "danger",
        title: translate("error"),
        message: translate("testSend.error.loadSampleData"),
      });
    }
  };

  const handleSend = async () => {
    try {
      await testSendSchema.validate({ toEmail, dataJson }, { abortEarly: false });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors: { toEmail?: string; dataJson?: string } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path as keyof typeof validationErrors] = err.message;
          }
        });
        setErrors(validationErrors);
      }
      return;
    }

    if (isConfigured === false) {
      toggleNotification({
        type: "danger",
        title: translate("error"),
        message: translate("testSend.error.notConfigured"),
      });
      return;
    }

    let data: Record<string, any> = {};
    try {
      data = parseData();
    } catch (error) {
      // This shouldn't happen since yup already validated JSON
      toggleNotification({
        type: "danger",
        title: translate("error"),
        message: translate("testSend.error.invalidJson"),
      });
      return;
    }

    let html = "";
    try {
      await new Promise<void>((resolve) => {
        emailEditorRef.current?.editor?.exportHtml((exported: any) => {
          html = exported?.html || "";
          resolve();
        });
      });
    } catch (error) {
      toggleNotification({
        type: "danger",
        title: translate("error"),
        message: translate("testSend.error.failed"),
      });
      return;
    }

    setSending(true);
    try {
      await sendTestEmail({
        to: toEmail.trim(),
        subject: subject || "",
        html,
        text: bodyText || "",
        data,
      });

      toggleNotification({
        type: "success",
        title: translate("success"),
        message: translate("testSend.success"),
      });
      onClose();
    } catch (error) {
      toggleNotification({
        type: "danger",
        title: translate("error"),
        message: translate("testSend.error.failed"),
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Content>
        <Dialog.Header>{translate("testSend.title")}</Dialog.Header>
        <Dialog.Body style={{ alignItems: "start" }}>
          <Field.Root required width="100%" style={{ marginBottom: "20px" }} error={errors.toEmail}>
            <Field.Label>{translate("testSend.to.label")}</Field.Label>
            <Field.Input
              placeholder={translate("testSend.to.placeholder")}
              value={toEmail}
              onChange={(event: any) => setToEmail(event.target.value)}
              type="email"
            />
            <Field.Error />
          </Field.Root>

          <Field.Root width="100%" error={errors.dataJson}>
            <Field.Label>{translate("testSend.data.label")}</Field.Label>
            <Textarea
              placeholder={translate("testSend.data.placeholder")}
              value={dataJson}
              onChange={(event: any) => setDataJson(event.target.value)}
              style={{ resize: "vertical", minHeight: "120px" }}
            />
            <Field.Error />
          </Field.Root>
          <Typography textColor="neutral600" variant="pi" style={{ marginBottom: "12px" }}>
            {translate("testSend.data.help")}
          </Typography>

          <Button
            style={{ width: "100%" }}
            variant="secondary"
            size="S"
            onClick={() => handleLoadSampleData("reset-password")}
          >
            {translate("testSend.loadResetPasswordData")}
          </Button>

          <Button
            style={{ width: "100%" }}
            variant="secondary"
            size="S"
            onClick={() => handleLoadSampleData("email-confirmation")}
          >
            {translate("testSend.loadEmailConfirmationData")}
          </Button>

          {checkingConfig && (
            <Typography textColor="neutral600" variant="pi">
              {translate("testSend.config.checking")}
            </Typography>
          )}
          {isConfigured === false && (
            <Typography style={{ fontWeight: "bold" }} textColor="danger600" variant="pi">
              {translate("testSend.error.notConfigured")}
            </Typography>
          )}
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Cancel>
            <Button fullWidth variant="tertiary">
              {translate("cancel")}
            </Button>
          </Dialog.Cancel>
          <Button
            onClick={handleSend}
            fullWidth
            variant="success-light"
            disabled={sending || checkingConfig || isConfigured === false || Object.keys(errors).length > 0}
          >
            {sending ? translate("testSend.sending") : translate("testSend.action")}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default TestSendModal;
