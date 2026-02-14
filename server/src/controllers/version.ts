import type { Core } from "@strapi/strapi";
import configImport from "../config";

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Get version history for a template
   */
  getVersionHistory: async (ctx) => {
    const { templateId } = ctx.params;
    try {
      const versions = await strapi
        .plugin(configImport.pluginName)
        .service("version")
        .getVersionHistory(templateId);
      ctx.send(versions);
    } catch (error) {
      ctx.badRequest(null, error);
    }
  },

  /**
   * Get a specific version
   */
  getVersion: async (ctx) => {
    const { versionId } = ctx.params;
    try {
      const version = await strapi.plugin(configImport.pluginName).service("version").getVersion(versionId);
      if (!version) {
        return ctx.notFound("Version not found");
      }
      ctx.send(version);
    } catch (error) {
      ctx.badRequest(null, error);
    }
  },

  /**
   * Restore a template to a previous version
   */
  restoreVersion: async (ctx) => {
    const { templateId, versionId } = ctx.params;
    const { reason } = ctx.request.body;

    try {
      // Get current user ID if available (optional)
      const userId = ctx.state.user?.id || "system";

      const updatedTemplate = await strapi
        .plugin(configImport.pluginName)
        .service("version")
        .restoreVersion(templateId, versionId, userId, reason);

      ctx.send({
        message: "Template restored successfully",
        template: updatedTemplate,
      });
    } catch (error: any) {
      ctx.badRequest(null, error.message);
    }
  },

  /**
   * Delete a specific version
   */
  deleteVersion: async (ctx) => {
    const { versionId } = ctx.params;

    try {
      await strapi.plugin(configImport.pluginName).service("version").deleteVersion(versionId);
      ctx.send({ removed: true });
    } catch (error) {
      ctx.badRequest(null, error);
    }
  },
});

export default controller;
