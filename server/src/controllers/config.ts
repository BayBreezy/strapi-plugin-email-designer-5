import type { Core } from "@strapi/strapi";
import configImport from "../config";

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Retrieve a specific email-designer-5 plugin configuration by key
   *
   * HTTP endpoint handler that fetches a particular configuration value from the plugin config.
   * The configuration key is passed as a URL parameter.
   *
   * @async
   * @param {Object} ctx - Koa context object
   * @param {Object} ctx.params - Route parameters
   * @param {string} ctx.params.configKey - The configuration key to retrieve (e.g., "editor")
   * @returns {Promise<void>} Sends the configuration object as JSON response
   *
   * @example
   * // GET /email-designer-5/config/editor
   * // Response: { projectId: "123", locale: "en", ...editor config }
   *
   * @example
   * // GET /email-designer-5/config/custom
   * // Response: { customField: "value", ...custom config }
   */
  getConfig: async (ctx) => {
    const { configKey } = ctx.params;
    const config = await strapi.plugin(configImport.pluginName).service("config").getConfig(configKey);
    ctx.send(config);
  },

  /**
   * Retrieve the complete email-designer-5 plugin configuration
   *
   * HTTP endpoint handler that fetches all plugin configuration settings.
   * Returns the entire plugin config object including editor config, custom options, and all settings.
   *
   * @async
   * @param {Object} ctx - Koa context object
   * @returns {Promise<void>} Sends the complete plugin configuration object as JSON response
   *
   * @example
   * // GET /email-designer-5/config
   * // Response: {
   * //   editor: { projectId: "123", locale: "en", ... },
   * //   mergeTags: { ... },
   * //   pluginName: "email-designer-5",
   * //   ...all other plugin config
   * // }
   */
  getFullConfig: async (ctx) => {
    const config = await strapi.config.get(`plugin::${configImport.pluginName}`);
    ctx.send(config);
  },
});

export default controller;
