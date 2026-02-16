import type { Core } from "@strapi/strapi";
import { htmlToText } from "html-to-text";
import { Context } from "koa";
import _, { isEqual, isNil } from "lodash";
import * as yup from "yup";
import configImport from "../config";

const isValidRefId = yup.number().required().label("Template reference ID").min(0);

/**
 * email-designer.js controller
 *
 * @description: A set of functions called "actions" of the `email-designer` plugin.
 */
const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Get template design action.
   *
   * @return {Object}
   */
  getTemplates: async (ctx) => {
    const templates = await strapi.plugin(configImport.pluginName).service("template").findMany();
    ctx.send(templates);
  },

  /**
   * Get template design action.
   *
   * @return {Object}
   */
  getTemplate: async (ctx) => {
    const template = await strapi
      .plugin(configImport.pluginName)
      .service("template")
      .findOne({ id: ctx.params.templateId });
    ctx.send(template);
  },

  /**
   * Delete template design action.
   *
   * @return {Object}
   */
  deleteTemplate: async (ctx) => {
    isValidRefId.validateSync(ctx.params.templateId);
    await strapi.plugin(configImport.pluginName).service("template").delete({ id: ctx.params.templateId });
    ctx.send({ removed: true });
  },

  /**
   * Save template design action.
   *
   * @return {Object}
   */
  saveTemplate: async (ctx) => {
    let { templateId } = ctx.params;

    const { templateReferenceId, import: importTemplate } = ctx.request.body;
    try {
      if (importTemplate === true) {
        if (!isNil(templateReferenceId)) {
          const foundTemplate = await strapi.plugin(configImport.pluginName).service("template").findOne({
            templateReferenceId,
          });

          if (!_.isEmpty(foundTemplate)) {
            if (templateId === "new") return ctx.badRequest("Template reference ID is already taken");

            // override the existing entry with imported data
            templateId = foundTemplate.id;
          } else {
            templateId = "new";
          }
        } else {
          templateId = "new";
        }
      }

      let template = {};
      if (templateId === "new") {
        // check if any other template with the same templateReferenceId exists
        const existingTemplate = await strapi.plugin(configImport.pluginName).service("template").findOne({
          templateReferenceId,
        });
        if (!_.isEmpty(existingTemplate)) {
          return ctx.badRequest("Template reference ID is already taken");
        }
        template = await strapi.plugin(configImport.pluginName).service("template").create(ctx.request.body);
      } else {
        // check if any other template with the same templateReferenceId exists
        // the one being updated is excluded
        const existingTemplate = await strapi
          .plugin(configImport.pluginName)
          .service("template")
          .findOne({
            templateReferenceId,
            id: { $ne: templateId },
          });
        if (!_.isEmpty(existingTemplate)) {
          return ctx.badRequest("Template reference ID is already taken");
        }
        const oldTemplate = await strapi
          .plugin(configImport.pluginName)
          .service("template")
          .findOne({ id: templateId });

        template = await strapi
          .plugin(configImport.pluginName)
          .service("template")
          .update({ id: templateId }, ctx.request.body);

        // Check if any of the following changed: design, name, subject, bodyHtml, bodyText, tags

        if (
          !isEqual(oldTemplate.design, ctx.request.body.design) ||
          oldTemplate.name !== ctx.request.body.name ||
          oldTemplate.subject !== ctx.request.body.subject
        ) {
          // Track which fields changed
          const changedFields = [];
          if (!isEqual(oldTemplate.design, ctx.request.body.design)) changedFields.push("design");
          if (oldTemplate.name !== ctx.request.body.name) changedFields.push("name");
          if (oldTemplate.subject !== ctx.request.body.subject) changedFields.push("subject");
          if (oldTemplate.bodyHtml !== ctx.request.body.bodyHtml) changedFields.push("bodyHtml");
          if (oldTemplate.bodyText !== ctx.request.body.bodyText) changedFields.push("bodyText");
          if (!isEqual(oldTemplate.tags, ctx.request.body.tags)) changedFields.push("tags");

          // Get version count to calculate next version number
          const versionCount = await strapi.db
            .query(`plugin::${configImport.pluginName}.email-designer-template-version`)
            .count({
              where: { templateId },
            });

          // Get user ID from context if available
          const userId = ctx.state.user?.id || "system";

          // Get a fresh instance of the updated template to ensure we have the latest data (in case there are any lifecycle hooks that modify the data after update)
          const updatedTemplate = await strapi
            .plugin(configImport.pluginName)
            .service("template")
            .findOne({ id: templateId });

          // save the previous version of the template
          await strapi
            .documents(`plugin::${configImport.pluginName}.email-designer-template-version`)
            .create({
              data: {
                templateId: updatedTemplate.id,
                design: updatedTemplate.design,
                name: updatedTemplate.name,
                subject: updatedTemplate.subject,
                bodyHtml: updatedTemplate.bodyHtml,
                bodyText: updatedTemplate.bodyText,
                tags: updatedTemplate.tags,
                versionNumber: versionCount + 1,
                changedBy: userId,
                changesSummary: { changed: changedFields },
              },
            });
        }
      }

      ctx.send(template || {});
    } catch (error) {
      console.log(error);

      ctx.badRequest(null, error);
    }
  },

  /**
   * Duplicate a template.
   *
   * @return {Object}
   */
  duplicateTemplate: async (ctx) => {
    if (_.isEmpty(ctx.params.sourceTemplateId)) {
      return ctx.badRequest("No source template Id given");
    }

    const { __v, _id, id, updatedAt, createdAt, ...toClone } = await strapi
      .plugin(configImport.pluginName)
      .service("template")
      .findOne({ id: ctx.params.sourceTemplateId });

    if (toClone) {
      return strapi
        .plugin(configImport.pluginName)
        .service("template")
        .create({ ...toClone, name: `${toClone.name} copy`, templateReferenceId: null });
    }
    return null;
  },

  /**
   * Downloads a template
   */
  download: async (ctx) => {
    try {
      const { id } = ctx.params;
      const { type = "json" } = ctx.query;
      // get the template by id
      const template = await strapi.plugin(configImport.pluginName).service("template").findOne({ id });
      if (!template) {
        return ctx.notFound("Template not found");
      }
      let fileContent, fileName;
      if (type === "json") {
        // Serve JSON design
        fileContent = JSON.stringify(template.design, null, 2);
        fileName = `template-${id}.json`;
        ctx.set("Content-Type", "application/json");
      } else if (type === "html") {
        // Serve HTML design
        fileContent = template.bodyHtml;
        fileName = `template-${id}.html`;
        ctx.set("Content-Type", "text/html");
      } else {
        return ctx.badRequest('Invalid type, must be either "json" or "html".');
      }
      // Set the content disposition to prompt a file download
      ctx.set("Content-Disposition", `attachment; filename="${fileName}"`);
      ctx.send(fileContent);
    } catch (err) {
      strapi.log.error("Error downloading template:", err);
      ctx.internalServerError("Failed to download the template");
    }
  },

  /**
   * Check email provider status
   */
  getEmailStatus: async (ctx) => {
    const configured = strapi.plugin(configImport.pluginName).service("email").isEmailProviderConfigured();

    ctx.send({ configured });
  },

  /**
   * Get sample data for core email types
   */
  getSampleData: async (ctx: Context) => {
    const { type } = ctx.params;

    if (!["reset-password", "email-confirmation"].includes(type)) {
      return ctx.badRequest("Invalid type. Must be 'reset-password' or 'email-confirmation'");
    }

    const sampleData = strapi
      .plugin(configImport.pluginName)
      .service("email")
      .generateCoreEmailSampleData(type as "reset-password" | "email-confirmation");

    ctx.send(sampleData);
  },

  /**
   * Send a test email using the current editor content
   */
  testSend: async (ctx: Context) => {
    const { to, subject, html, text, data } = ctx.request.body || {};

    if (!to) {
      return ctx.badRequest("Recipient email is required");
    }

    if (!html && !text) {
      return ctx.badRequest("Email content is required");
    }

    const safeData = data && typeof data === "object" ? data : {};

    try {
      await strapi
        .plugin(configImport.pluginName)
        .service("email")
        .sendTestEmail({ to }, { subject, html, text }, safeData);

      ctx.send({ sent: true });
    } catch (error: any) {
      if (error?.message === "Email provider not configured") {
        return ctx.badRequest("Email provider not configured");
      }

      ctx.badRequest(error?.message || "Failed to send test email");
    }
  },

  /**
   * Strapi's core templates
   */

  /**
   * Get strapi's core message template action.
   *
   * @return {Object}
   */
  getCoreEmailType: async (ctx: Context) => {
    const { coreEmailType } = ctx.params;
    if (!["user-address-confirmation", "reset-password"].includes(coreEmailType))
      return ctx.badRequest("No valid core message key");

    const pluginStoreEmailKey =
      coreEmailType === "user-address-confirmation" ? "email_confirmation" : "reset_password";

    const pluginStore = await strapi.store({
      environment: "",
      type: "plugin",
      name: "users-permissions",
    });

    let data = await pluginStore.get({ key: "email" }).then((storeEmail) => storeEmail[pluginStoreEmailKey]);

    data = {
      ...(data && data.options
        ? {
            from: data.options.from,
            message: data.options.message,
            subject: data.options.object.replace(/<%|&#x3C;%/g, "{{").replace(/%>|%&#x3E;/g, "}}"),
            bodyHtml: data.options.message.replace(/<%|&#x3C;%/g, "{{").replace(/%>|%&#x3E;/g, "}}"),
            bodyText: htmlToText(
              data.options.message.replace(/<%|&#x3C;%/g, "{{").replace(/%>|%&#x3E;/g, "}}"),
              {
                wordwrap: 130,
              }
            ),
          }
        : {}),
      coreEmailType,
      design: data.design,
    };

    ctx.send(data);
  },

  /**
   * Save strapi's core message template action.
   *
   * @return {Object}
   */
  saveCoreEmailType: async (ctx: Context) => {
    const { coreEmailType } = ctx.params;
    if (!["user-address-confirmation", "reset-password"].includes(coreEmailType))
      return ctx.badRequest("No valid core message key");

    const pluginStoreEmailKey =
      coreEmailType === "user-address-confirmation" ? "email_confirmation" : "reset_password";

    const pluginStore = await strapi.store({
      environment: "",
      type: "plugin",
      name: "users-permissions",
    });

    const emailsConfig = await pluginStore.get({ key: "email" });
    const config = strapi.plugin(configImport.pluginName).services.config.getConfig();

    emailsConfig[pluginStoreEmailKey] = {
      ...emailsConfig[pluginStoreEmailKey],
      options: {
        ...(emailsConfig[pluginStoreEmailKey] ? emailsConfig[pluginStoreEmailKey].options : {}),
        message: ctx.request.body.message.replace(/{{/g, "<%").replace(/}}/g, "%>"),
        object: ctx.request.body.subject.replace(/{{/g, "<%").replace(/}}/g, "%>"),
        // TODO: from: ctx.request.from,
        // TODO: response_email: ctx.request.response_email,
      },
      design: ctx.request.body.design,
    };

    await pluginStore.set({ key: "email", value: emailsConfig });

    ctx.send({ message: "Saved" });
  },
});

export default controller;
