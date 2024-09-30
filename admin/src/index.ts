import { Initializer } from "./components/Initializer";
import { PluginIcon } from "./components/PluginIcon";
import { APP_PERMISSIONS } from "./permissions";
import { PLUGIN_ID } from "./pluginId";
import { prefixPluginTranslations } from "./utils/prefixPluginTranslations";

export default {
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
