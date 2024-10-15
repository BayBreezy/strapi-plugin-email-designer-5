export default [
  {
    method: "GET",
    path: "/templates",
    handler: "designer.getTemplates",
    config: { policies: [], auth: false },
  },
  {
    method: "GET",
    path: "/templates/:templateId",
    handler: "designer.getTemplate",
    config: { policies: [], auth: false },
  },
  {
    method: "POST",
    path: "/templates/:templateId",
    handler: "designer.saveTemplate",
    config: { policies: [], auth: false },
  },
  {
    method: "DELETE",
    path: "/templates/:templateId",
    handler: "designer.deleteTemplate",
    config: { policies: [], auth: false },
  },
  {
    method: "POST",
    path: "/templates/duplicate/:sourceTemplateId",
    handler: "designer.duplicateTemplate",
    config: { policies: [], auth: false },
  },
  {
    method: "GET",
    path: "/config/:configKey",
    handler: "config.getConfig",
    config: { policies: [], auth: false },
  },
  {
    method: "GET",
    path: "/config",
    handler: "config.getFullConfig",
    config: { policies: [], auth: false },
  },
  {
    method: "GET",
    path: "/core/:coreEmailType",
    handler: "designer.getCoreEmailType",
    config: { policies: [], auth: false },
  },
  {
    method: "POST",
    path: "/core/:coreEmailType",
    handler: "designer.saveCoreEmailType",
    config: { policies: [], auth: false },
  },
  {
    method: "GET",
    path: "/download/:id",
    handler: "designer.download",
    config: { policies: [], auth: false },
  },
];
