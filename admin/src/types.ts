import type { EmailEditorProps } from "react-email-editor";

export type EmailTemplate = {
  templateReferenceId?: number;
  design?: any;
  name?: string;
  subject?: string;
  bodyHtml?: string | null;
  bodyText?: string | null;
  tags?: Array<string>;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  documentId?: string;
  message?: string;
  id?: any;
  import?: boolean;
};

export type EmailConfig = Pick<
  NonNullable<EmailEditorProps["options"]>,
  | "projectId"
  | "locale"
  | "appearance"
  | "user"
  | "mergeTags"
  | "designTags"
  | "specialLinks"
  | "tools"
  | "blocks"
  | "fonts"
  | "safeHtml"
  | "customCSS"
  | "customJS"
  | "textDirection"
>;
