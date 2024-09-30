import { PLUGIN_ID } from "../pluginId";

/**
 * Prefix & returns the translation string with the plugin's id
 */
const getTranslation = (id: string) => `${PLUGIN_ID}.${id}`;

export { getTranslation };
