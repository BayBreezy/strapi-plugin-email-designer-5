import type { Core } from "@strapi/strapi";
import config from "./config";

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  // Register permission actions.
  const actions = [
    {
      section: "plugins",
      displayName: "Access Email Designer",
      uid: "menu-link",
      pluginName: config.pluginName,
    },
  ];
  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};

export default bootstrap;
