import type { Core } from "@strapi/strapi";
import configImport from "../config";

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  getConfig(key = "editor") {
    return strapi.plugin(configImport.pluginName).config(key) ?? {};
  },
});

export default service;
