import { Initializer } from "./components/Initializer";
import { PluginIcon } from "./components/PluginIcon";
import { APP_PERMISSIONS } from "./permissions";
import { PLUGIN_ID } from "./pluginId";
import { prefixPluginTranslations } from "./utils/prefixPluginTranslations";

export default {
  /**
   * Register the plugin with the Strapi admin application
   *
   * Sets up the plugin's menu link, route, permissions, and initialization.
   * Creates a new menu item in the Strapi admin sidebar and registers the plugin
   * with the initializer component.
   *
   * @param {any} app - The Strapi admin application instance
   * @returns {void}
   *
   * @example
   * // Called automatically by Strapi during plugin initialization
   * register(app)
   */
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage: PLUGIN_ID,
      },
      Component: () =>
        import("./pages/App").then((mod) => ({
          default: mod.App,
        })),
      permissions: APP_PERMISSIONS["menu-link"],
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  /**
   * Register and load translations for the plugin in specified locales
   *
   * Dynamically imports translation files for each supported locale and prefixes
   * the translation keys with the plugin ID. Falls back to empty translation
   * objects if a locale file is not found.
   *
   * @async
   * @param {Object} params - Parameters object
   * @param {string[]} params.locales - Array of locale codes to load translations for (e.g., ['en', 'es', 'fr'])
   * @returns {Promise<Array>} Promise resolving to array of objects with locale and prefixed translation data
   *
   * @example
   * // Called automatically by Strapi during plugin initialization
   * await registerTrads({ locales: ['en', 'es', 'fr'] })
   * // Returns: [
   * //   { locale: 'en', data: { 'email-designer-5.page.title': '...' } },
   * //   { locale: 'es', data: { 'email-designer-5.page.title': '...' } },
   * //   ...
   * // ]
   */
  async registerTrads({ locales }: { locales: string[] }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, PLUGIN_ID),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
