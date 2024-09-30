import axios from "axios";
import dayjs from "dayjs";
import { pluginName } from "../pluginId";
import { EmailConfig, EmailTemplate } from "../types";

/**
 * Date format for displaying dates in the UI
 */
export const DATE_FORMAT = "MMM DD, YYYY [at] h:mmA";

/**
 * Fetches all email templates
 */
export const getTemplatesData = async () => {
  const { data } = await axios.get<EmailTemplate[]>(`/${pluginName}/templates`);
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
  const { data } = await axios.get(`/${pluginName}/config/${key}`);
  return data;
};

/**
 * Get the full editor configuration
 */
export const getFullEditorConfig = async () => {
  const { data } = await axios.get<EmailConfig>(`/${pluginName}/config`);
  return data;
};

/**
 * Get the email template by the ID
 */
export const getTemplateById = async (id: string) => {
  const { data } = await axios.get<EmailTemplate>(`/${pluginName}/templates/${id}`);
  return data;
};

/**
 * Get the core email template by the type
 */
export const getCoreTemplate = async (coreEmailType: string) => {
  const { data } = await axios.get<EmailTemplate>(`/${pluginName}/core/${coreEmailType}`);
  return data;
};

/**
 * Create/Update a custom email template
 */
export const createTemplate = async (templateId: string, data: EmailTemplate) => {
  const { data: response } = await axios.post<EmailTemplate>(`/${pluginName}/templates/${templateId}`, data);
  return response;
};

/**
 * Update a core email template
 */
export const updateCoreTemplate = async (coreEmailType: string, data: EmailTemplate) => {
  const { data: response } = await axios.post<EmailTemplate>(`/${pluginName}/core/${coreEmailType}`, data);
  return response;
};

/**
 * Duplicate a custom email template
 */
export const duplicateTemplate = async (id: string) => {
  const { data } = await axios.post<EmailTemplate>(`/${pluginName}/templates/duplicate/${id}`);
  return data;
};

/**
 * Delete a custom email template
 */
export const deleteTemplate = async (id: string) => {
  await axios.delete(`/${pluginName}/templates/${id}`);
};
