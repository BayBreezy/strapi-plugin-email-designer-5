export default {
  "email-designer-template-version": {
    schema: {
      kind: "collectionType",
      collectionName: "email-designer-template-versions",
      info: {
        singularName: "email-designer-template-version",
        pluralName: "email-designer-template-versions",
        displayName: "Email Designer Template Versions",
        description: "This collection keeps track of the changes made to the different templates.",
      },
      pluginOptions: {
        "content-manager": { visible: true },
        "content-type-builder": { visible: false },
      },
      options: { draftAndPublish: false, timestamps: true },
      attributes: {
        templateId: {
          type: "relation",
          relation: "manyToOne",
          target: "plugin::email-designer-5.email-designer-template",
          inversedBy: "versions",
        },
        versionNumber: { type: "integer", configurable: false },
        design: { type: "json", configurable: false },
        name: { type: "string", configurable: false },
        subject: { type: "string", configurable: false },
        bodyHtml: { type: "text", configurable: false },
        bodyText: { type: "text", configurable: false },
        tags: { type: "json" },
        changedBy: { type: "string", configurable: false },
        changeReason: { type: "text", configurable: false },
        changesSummary: { type: "json", configurable: false },
      },
    },
  },
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
      options: { draftAndPublish: false, timestamps: true },
      attributes: {
        templateReferenceId: { type: "integer", required: false, unique: true, configurable: false },
        design: { type: "json", configurable: false },
        name: { type: "string", configurable: false },
        subject: { type: "string", configurable: false },
        bodyHtml: { type: "text", configurable: false },
        bodyText: { type: "text", configurable: false },
        tags: { type: "json" },
        versions: {
          type: "relation",
          relation: "oneToMany",
          target: "plugin::email-designer-5.email-designer-template-version",
          mappedBy: "templateId",
        },
      },
    },
  },
};
