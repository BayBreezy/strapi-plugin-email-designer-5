export default {
  "email-designer-template": {
    schema: {
      kind: "collectionType",
      collectionName: "email-designer-templates",
      info: {
        singularName: "email-designer-template",
        pluralName: "email-designer-templates",
        displayName: "Email Designer Templates",
        description: "This collection stores email templates created with the email designer.",
      },
      pluginOptions: {
        "content-manager": { visible: false },
        "content-type-builder": { visible: false },
      },
      options: {
        draftAndPublish: false,
      },
      attributes: {
        templateReferenceId: {
          type: "integer",
          required: false,
          unique: true,
          configurable: false,
        },
        design: {
          type: "json",
          configurable: false,
        },
        name: {
          type: "string",
          configurable: false,
        },
        subject: {
          type: "string",
          configurable: false,
        },
        bodyHtml: {
          type: "text",
          configurable: false,
        },
        bodyText: {
          type: "text",
          configurable: false,
        },
        tags: {
          type: "json",
        },
      },
    },
  },
};
