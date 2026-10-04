import { getFetchClient } from "@strapi/strapi/admin";
import dayjs from "dayjs";
import { pluginName } from "../pluginId";
import { EmailConfig, EmailTemplate } from "../types";

/**
 * Date format for displaying dates in the UI
 */
export const DATE_FORMAT = "MMM DD, YYYY [at] h:mmA";

/**
 * Strapi's admin fetch client: resolves URLs against the backend URL (the admin
 * panel may be hosted on a different origin) and sends the admin auth token.
 */
const fetchClient = () => getFetchClient();

/**
 * Fetches all email templates, optionally filtered by search term
 */
export const getTemplatesData = async (search?: string) => {
  const params = new URLSearchParams();
  if (search && search.trim().length > 0) {
    params.append("search", search.trim());
  }

  const queryString = params.toString();
  const url = queryString ? `/${pluginName}/templates?${queryString}` : `/${pluginName}/templates`;

  const { data } = await fetchClient().get<EmailTemplate[]>(url);
  data.forEach((template) => {
    template.createdAt = dayjs(template.createdAt).format(DATE_FORMAT);
    template.updatedAt = dayjs(template.updatedAt).format(DATE_FORMAT);
  });
  return data;
};

/**
 * Get the editor configuration by the key passed in
 */
export const getEditorConfig = async (key: string = "editor") => {
  const { data } = await fetchClient().get(`/${pluginName}/config/${key}`);
  return data;
};

/**
 * Get the full editor configuration
 */
export const getFullEditorConfig = async () => {
  const { data } = await fetchClient().get<EmailConfig>(`/${pluginName}/config`);
  return data;
};

/**
 * Get the email template by the ID
 */
export const getTemplateById = async (id: string) => {
  const { data } = await fetchClient().get<EmailTemplate>(`/${pluginName}/templates/${id}`);
  return data;
};

/**
 * Get the core email template by the type
 */
export const getCoreTemplate = async (coreEmailType: string) => {
  const { data } = await fetchClient().get<EmailTemplate>(`/${pluginName}/core/${coreEmailType}`);
  return data;
};

/**
 * Create/Update a custom email template
 */
export const createTemplate = async (templateId: string, data: EmailTemplate) => {
  const { data: response } = await fetchClient().post<EmailTemplate>(
    `/${pluginName}/templates/${templateId}`,
    data
  );
  return response;
};

/**
 * Update a core email template
 */
export const updateCoreTemplate = async (coreEmailType: string, data: EmailTemplate) => {
  const { data: response } = await fetchClient().post<EmailTemplate>(
    `/${pluginName}/core/${coreEmailType}`,
    data
  );
  return response;
};

/**
 * Duplicate a custom email template
 */
export const duplicateTemplate = async (id: string) => {
  const { data } = await fetchClient().post<EmailTemplate>(`/${pluginName}/templates/duplicate/${id}`);
  return data;
};

/**
 * Delete a custom email template
 */
export const deleteTemplate = async (id: string) => {
  await fetchClient().del(`/${pluginName}/templates/${id}`);
};

/**
 * Download a based on the ID and the type passed in.
 *
 * This triggers a download of the file.
 */
export const downloadTemplate = async (id: string, type: "html" | "json") => {
  // Build the file from the template data (same content as the /download endpoint),
  // so the request goes through the authenticated admin fetch client.
  const template = await getTemplateById(id);
  const fileContent = type === "json" ? JSON.stringify(template.design, null, 2) : (template.bodyHtml ?? "");
  const blob = new Blob([fileContent], { type: type === "json" ? "application/json" : "text/html" });

  // Create a URL for the Blob
  const downloadUrl = window.URL.createObjectURL(blob);

  // Create a temporary <a> element to trigger the download
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.setAttribute("download", `template-${id}.${type}`);

  // Append the link to the body (this is required for some browsers)
  document.body.appendChild(link);

  // Programmatically click the link to trigger the download
  link.click();

  // Clean up and remove the link after the download is triggered
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
};

/**
 * Fetch version history for a template
 */
export const getVersionHistory = async (templateId: string) => {
  const { data } = await fetchClient().get(`/${pluginName}/templates/${templateId}/versions`);
  return data;
};

/**
 * Get a specific version details
 */
export const getVersionDetails = async (templateId: string, versionId: string) => {
  const { data } = await fetchClient().get(`/${pluginName}/templates/${templateId}/versions/${versionId}`);
  return data;
};

/**
 * Restore a template to a previous version
 */
export const restoreTemplateVersion = async (templateId: string, versionId: string, reason?: string) => {
  const { data } = await fetchClient().post(
    `/${pluginName}/templates/${templateId}/versions/${versionId}/restore`,
    {
      reason,
    }
  );
  return data;
};

/**
 * Delete a specific version
 */
export const deleteTemplateVersion = async (templateId: string, versionId: string) => {
  await fetchClient().del(`/${pluginName}/templates/${templateId}/versions/${versionId}`);
};

/**
 * Check if email provider is configured
 */
export const getEmailProviderStatus = async () => {
  const { data } = await fetchClient().get<{ configured: boolean }>(`/${pluginName}/email/status`);
  return data;
};

/**
 * Get sample data for core email types
 */
export const getSampleEmailData = async (type: "reset-password" | "email-confirmation") => {
  const { data } = await fetchClient().get<Record<string, any>>(`/${pluginName}/email/sample-data/${type}`);
  return data;
};

/**
 * Send a test email using the current editor content
 */
export const sendTestEmail = async (payload: {
  to: string;
  subject: string;
  html: string;
  text: string;
  data?: Record<string, any>;
}) => {
  const { data } = await fetchClient().post(`/${pluginName}/email/test-send`, payload);
  return data;
};
