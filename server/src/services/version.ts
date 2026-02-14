import type { Core } from "@strapi/strapi";
import { pluginUID, pluginVersionUID } from "./email";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Get all versions for a template
   * @param templateId - The ID of the template
   * @returns Array of versions
   */
  async getVersionHistory(templateId: string) {
    const versions = await strapi.db.query(pluginVersionUID).findMany({
      where: { templateId },
      orderBy: { createdAt: "desc" },
      populate: ["templateId"],
    });
    return versions;
  },

  /**
   * Get a specific version
   * @param versionId - The ID of the version
   * @returns Version data
   */
  async getVersion(versionId: string) {
    const version = await strapi.db.query(pluginVersionUID).findOne({
      where: { id: versionId },
      populate: ["templateId"],
    });
    return version;
  },

  /**
   * Restore a template to a previous version
   * @param templateId - The ID of the template to restore
   * @param versionId - The ID of the version to restore to
   * @param userId - The user ID making the restore
   * @param reason - The reason for the restore
   * @returns Updated template
   */
  async restoreVersion(templateId: string, versionId: string, userId?: string, reason?: string) {
    // Get the version to restore
    const versionToRestore = await strapi.db.query(pluginVersionUID).findOne({
      where: { id: versionId },
      populate: ["templateId"],
    });

    if (!versionToRestore) {
      throw new Error(`Version with ID "${versionId}" not found`);
    }

    // Get the current template
    const currentTemplate = await strapi.db.query(pluginUID).findOne({
      where: { id: templateId },
    });

    if (!currentTemplate) {
      throw new Error(`Template with ID "${templateId}" not found`);
    }

    // Check if the version belongs to this template (compare documentId)
    if (versionToRestore.templateId?.documentId !== currentTemplate.documentId) {
      throw new Error(`Version does not belong to this template`);
    }

    // Create a version entry for the current state (before restoring)
    const versionCount = await strapi.db.query(pluginVersionUID).count({
      where: { templateId },
    });

    await strapi.documents(pluginVersionUID as any).create({
      data: {
        templateId: currentTemplate.documentId,
        design: currentTemplate.design,
        name: currentTemplate.name,
        subject: currentTemplate.subject,
        bodyHtml: currentTemplate.bodyHtml,
        bodyText: currentTemplate.bodyText,
        tags: currentTemplate.tags,
        versionNumber: versionCount + 1,
        changedBy: userId,
        changeReason: `Restored from version ${versionToRestore.versionNumber}`,
        changesSummary: {
          restored: true,
          restoredFromVersion: versionToRestore.versionNumber,
        },
      },
    });

    // Update template with restored version data
    const updatedTemplate = await strapi.db.query(pluginUID).update({
      where: { id: templateId },
      data: {
        design: versionToRestore.design,
        name: versionToRestore.name,
        subject: versionToRestore.subject,
        bodyHtml: versionToRestore.bodyHtml,
        bodyText: versionToRestore.bodyText,
        tags: versionToRestore.tags,
      },
    });

    return updatedTemplate;
  },

  /**
   * Delete a specific version
   * @param versionId - The ID of the version to delete
   */
  async deleteVersion(versionId: string) {
    await strapi.db.query(pluginVersionUID).delete({
      where: { id: versionId },
    });
  },
});
