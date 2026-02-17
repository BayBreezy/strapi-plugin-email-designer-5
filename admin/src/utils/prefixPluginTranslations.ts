/**
 * Prefix translation keys with a plugin identifier
 *
 * Transforms a flat translation object by prefixing each key with the plugin ID.
 * This ensures translation keys are namespaced to the plugin and avoids conflicts
 * with other plugins or core Strapi translations.
 *
 * @param {any} trad - Translation object with unprefixed keys
 * @param {string} pluginId - The plugin ID to use as a prefix
 * @returns {any} New translation object with all keys prefixed as "pluginId.originalKey"
 * @throws {TypeError} Throws if pluginId is empty or falsy
 *
 * @example
 * const translations = {
 *   "page.title": "Email Designer",
 *   "button.save": "Save"
 * };
 *
 * const prefixed = prefixPluginTranslations(translations, "email-designer-5");
 * // Result:
 * // {
 * //   "email-designer-5.page.title": "Email Designer",
 * //   "email-designer-5.button.save": "Save"
 * // }
 */
const prefixPluginTranslations = (trad: any, pluginId: string) => {
  if (!pluginId) {
    throw new TypeError("pluginId can't be empty");
  }
  return Object.keys(trad).reduce((acc, current) => {
    acc[`${pluginId}.${current}`] = trad[current];
    return acc;
  }, {} as any);
};

export { prefixPluginTranslations };
