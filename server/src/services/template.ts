import type { Core } from "@strapi/strapi";
import { pluginUID } from "./email";

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Promise to fetch a template.
   * @return {Promise}
   */
  findOne(params: any) {
    return strapi.db.query(pluginUID).findOne({ where: params });
  },

  /**
   * Promise to fetch all templates.
   * @return {Promise}
   */
  findMany(params: any) {
    return strapi.db.query(pluginUID).findMany({ where: params });
  },

  /**
   * Promise to add a template.
   * @return {Promise}
   */
  async create(values: any) {
    return strapi.db.query(pluginUID).create({ data: values });
  },

  /**
   * Promise to edit a template.
   * @return {Promise}
   */
  async update(params: any, values: any) {
    return strapi.db.query(pluginUID).update({ where: params, data: values });
  },

  /**
   * Promise to remove a template.
   * @return {Promise}
   */
  async delete(params: any) {
    return strapi.db.query(pluginUID).delete({ where: params });
  },
});

export default service;
