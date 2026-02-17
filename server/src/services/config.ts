import type { Core } from "@strapi/strapi";
import configImport from "../config";

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Retrieve plugin configuration by key
   *
   * Fetches configuration values from the email-designer-5 plugin config.
   * Returns an empty object if the configuration key does not exist.
   *
   * @param {string} [key="editor"] - The configuration key to retrieve.
   *                                  Defaults to "editor" if not provided.
   * @returns {any} The configuration object for the specified key, or an empty object if not found
   *
   * @example
   * // Get the default editor configuration
   * const editorConfig = strapi.plugin("email-designer-5").service("config").getConfig();
   *
   * @example
   * // Get a custom configuration key
   * const customConfig = strapi.plugin("email-designer-5").service("config").getConfig("custom");
   */
  getConfig(key = "editor") {
    return strapi.plugin(configImport.pluginName).config(key) ?? {};
  },
});

export default service;
