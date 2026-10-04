export default {
  // Admin dashboard only routes (require an authenticated admin user)
  admin: {
    type: "admin",
    routes: [
      {
        method: "GET",
        path: "/templates",
        handler: "designer.getTemplates",
        config: { policies: [] },
      },
      {
        method: "GET",
        path: "/templates/:templateId",
        handler: "designer.getTemplate",
        config: { policies: [] },
      },
      {
        method: "POST",
        path: "/templates/:templateId",
        handler: "designer.saveTemplate",
        config: { policies: [] },
      },
      {
        method: "DELETE",
        path: "/templates/:templateId",
        handler: "designer.deleteTemplate",
        config: { policies: [] },
      },
      {
        method: "POST",
        path: "/templates/duplicate/:sourceTemplateId",
        handler: "designer.duplicateTemplate",
        config: { policies: [] },
      },
      {
        method: "GET",
        path: "/config/:configKey",
        handler: "config.getConfig",
        config: { policies: [] },
      },
      {
        method: "GET",
        path: "/config",
        handler: "config.getFullConfig",
        config: { policies: [] },
      },
      {
        method: "GET",
        path: "/core/:coreEmailType",
        handler: "designer.getCoreEmailType",
        config: { policies: [] },
      },
      {
        method: "POST",
        path: "/core/:coreEmailType",
        handler: "designer.saveCoreEmailType",
        config: { policies: [] },
      },
      {
        method: "GET",
        path: "/download/:id",
        handler: "designer.download",
        config: { policies: [] },
      },
      {
        method: "GET",
        path: "/email/status",
        handler: "designer.getEmailStatus",
        config: { policies: [] },
      },
      {
        method: "GET",
        path: "/email/sample-data/:type",
        handler: "designer.getSampleData",
        config: { policies: [] },
      },
      {
        method: "POST",
        path: "/email/test-send",
        handler: "designer.testSend",
        config: { policies: [] },
      },
      {
        method: "GET",
        path: "/templates/:templateId/versions",
        handler: "version.getVersionHistory",
        config: { policies: [] },
      },
      {
        method: "GET",
        path: "/templates/:templateId/versions/:versionId",
        handler: "version.getVersion",
        config: { policies: [] },
      },
      {
        method: "POST",
        path: "/templates/:templateId/versions/:versionId/restore",
        handler: "version.restoreVersion",
        config: { policies: [] },
      },
      {
        method: "DELETE",
        path: "/templates/:templateId/versions/:versionId",
        handler: "version.deleteVersion",
        config: { policies: [] },
      },
    ],
  },
  // The content api routes
  "content-api": {
    type: "content-api",
    routes: [
      {
        method: "GET",
        path: "/templates",
        handler: "designer.getTemplates",
      },
      {
        method: "GET",
        path: "/templates/:templateId",
        handler: "designer.getTemplate",
      },
      {
        method: "GET",
        path: "/download/:id",
        handler: "designer.download",
      },
    ],
  },
};
