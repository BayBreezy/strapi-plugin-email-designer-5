export default {
  // Admin dashboard only routes
  admin: {
    type: "admin",
    routes: [
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
      {
        method: "GET",
        path: "/email/status",
        handler: "designer.getEmailStatus",
        config: { policies: [], auth: false },
      },
      {
        method: "GET",
        path: "/email/sample-data/:type",
        handler: "designer.getSampleData",
        config: { policies: [], auth: false },
      },
      {
        method: "POST",
        path: "/email/test-send",
        handler: "designer.testSend",
        config: { policies: [], auth: false },
      },
      {
        method: "GET",
        path: "/templates/:templateId/versions",
        handler: "version.getVersionHistory",
        config: { policies: [], auth: false },
      },
      {
        method: "GET",
        path: "/templates/:templateId/versions/:versionId",
        handler: "version.getVersion",
        config: { policies: [], auth: false },
      },
      {
        method: "POST",
        path: "/templates/:templateId/versions/:versionId/restore",
        handler: "version.restoreVersion",
        config: { policies: [], auth: false },
      },
      {
        method: "DELETE",
        path: "/templates/:templateId/versions/:versionId",
        handler: "version.deleteVersion",
        config: { policies: [], auth: false },
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
