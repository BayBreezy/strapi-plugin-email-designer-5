import type { EmailEditorProps } from "react-email-editor";

/**
 * Represents an email template in the Email Designer
 */
export type EmailTemplate = {
  /** Unique reference ID for the template (used for programmatic sending) */
  templateReferenceId?: number;

  /** Unlayer editor design object containing the template structure */
  design?: any;

  /** Display name of the template */
  name?: string;

  /** Email subject line (supports template variables) */
  subject?: string;

  /** HTML version of the email body */
  bodyHtml?: string | null;

  /** Plain text version of the email body */
  bodyText?: string | null;

  /** Array of tags for organizing and filtering templates */
  tags?: Array<string>;

  /** Timestamp when the template was created */
  createdAt?: string | Date;

  /** Timestamp when the template was last updated */
  updatedAt?: string | Date;

  /** Strapi document ID for the template record */
  documentId?: string;

  /** Message content (used for core templates) */
  message?: string;

  /** Internal ID of the template */
  id?: any;

  /** Flag indicating if this template is being imported */
  import?: boolean;
};

/**
 * Configuration options for the Email Designer (Unlayer editor)
 */
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

/**
 * Represents a version of an email template in the version history
 */
export type Version = {
  /** Unique identifier for this version */
  id: string;

  /** Sequential version number */
  versionNumber: number;

  /** User who created this version */
  changedBy: string;

  /** Summary of what changed in this version */
  changesSummary: { changed?: string[] } | { restored: boolean; restoredFromVersion: number };

  /** Timestamp when this version was created */
  createdAt: Date | string;

  /** Timestamp when this version was last updated */
  updatedAt?: Date | string;

  /** Unlayer editor design for this version */
  design?: any;

  /** HTML body content for this version */
  bodyHtml?: string | null;

  /** Plain text body content for this version */
  bodyText?: string | null;

  /** Email subject for this version */
  subject?: string | null;

  /** Template name for this version */
  name?: string | null;
};
