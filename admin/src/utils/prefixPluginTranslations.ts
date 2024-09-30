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
