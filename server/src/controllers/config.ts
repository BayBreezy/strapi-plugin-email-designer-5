import type { Core } from "@strapi/strapi";
import configImport from "../config";

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  getConfig: async (ctx) => {
    const { configKey } = ctx.params;
    const config = await strapi.plugin(configImport.pluginName).service("config").getConfig(configKey);
    ctx.send(config);
  },
  getFullConfig: async (ctx) => {
    const config = await strapi.config.get(`plugin::${configImport.pluginName}`);
    ctx.send(config);
  },
});

export default controller;
