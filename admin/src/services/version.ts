import { getFetchClient } from "@strapi/strapi/admin";
import { pluginName } from "../pluginId";

/**
 * Fetch version history for a template
 */
export const getVersionHistory = async (templateId: string) => {
  const { data } = await getFetchClient().get(`/${pluginName}/templates/${templateId}/versions`);
  return data;
};

/**
 * Get a specific version details
 */
export const getVersionDetails = async (templateId: string, versionId: string) => {
  const { data } = await getFetchClient().get(`/${pluginName}/templates/${templateId}/versions/${versionId}`);
  return data;
};

/**
 * Restore a template to a previous version
 */
export const restoreTemplateVersion = async (templateId: string, versionId: string, reason?: string) => {
  const { data } = await getFetchClient().post(
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
  await getFetchClient().del(`/${pluginName}/templates/${templateId}/versions/${versionId}`);
};
