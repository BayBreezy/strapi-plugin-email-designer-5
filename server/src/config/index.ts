import type { Core } from "@strapi/strapi";
import type { EmailEditorProps } from "react-email-editor";
import { disableVersioningContentTypes } from "../content-types";

export type EmailConfig = Pick<
  NonNullable<EmailEditorProps["options"]>,
  | "projectId"
  | "locale"
  | "appearance"
  | "user"
  | "mergeTags"
  | "designTags"
  | "specialLinks"
  | "tools"
  | "blocks"
  | "fonts"
  | "safeHtml"
  | "customCSS"
  | "customJS"
  | "textDirection"
> & {
  /**
   * Keep a history of the changes made to each template.
   *
   * When set to `false`, the version content type is removed from the plugin.
   * **Strapi will drop the existing versions table on the next start**, so any stored history is lost.
   *
   * @default true
   */
  enableVersioning?: boolean;
};

/** Whether template versioning is enabled in the plugin configuration */
export const isVersioningEnabled = (strapi: Core.Strapi) =>
  strapi.config.get<boolean>("plugin::email-designer-5.enableVersioning", true) !== false;

export default {
  default: () =>
    ({
      enableVersioning: true,
      mergeTagsConfig: {
        autocompleteTriggerChar: "@",
        sort: false,
        delimiter: ["{{", "}}"],
      },
      appearance: {
        theme: "modern_light",
      },
      fonts: {
        showDefaultFonts: false,
      },
      tools: {
        image: {
          properties: {
            src: {
              value: {
                url: "https://picsum.photos/600/350",
              },
            },
          },
        },
      },
      mergeTags: {
        core: {
          name: "Core",
          mergeTags: {
            // Values that can be used in the Reset Password context
            resetPassword: {
              name: "Reset Password",
              mergeTags: {
                // User in the Reset Password context
                user: {
                  name: "USER",
                  mergeTags: {
                    username: {
                      name: "Username",
                      value: "{{= USER.username }}",
                      sample: "john_doe",
                    },
                    email: {
                      name: "Email",
                      value: "{{= USER.email }}",
                      sample: "johndoe@example.com",
                    },
                  },
                },
                token: {
                  name: "TOKEN",
                  value: "{{= TOKEN }}",
                  sample: "corresponds-to-the-token-generated-to-be-able-to-reset-the-password",
                },
                url: {
                  name: "URL",
                  value: "{{= URL }}",
                  sample: "is-the-link-where-the-user-will-be-redirected-after-clicking-on-it-in-the-email",
                },
                serverUrl: {
                  name: "SERVER_URL",
                  value: "{{= SERVER_URL }}",
                  sample: "is-the-absolute-server-url-(configured-in-server-configuration)",
                },
              },
            },
            // Values that can be used in the Email Address Confirmation context
            addressConfirmation: {
              name: "Confirm Address",
              mergeTags: {
                // User in the Email Address Confirmation context
                user: {
                  name: "USER",
                  mergeTags: {
                    username: {
                      name: "Username",
                      value: "{{= USER.username }}",
                      sample: "john_doe",
                    },
                    email: {
                      name: "Email",
                      value: "{{= USER.email }}",
                      sample: "johndoe@example.com",
                    },
                  },
                },
                code: {
                  name: "CODE",
                  value: "{{= CODE }}",
                  sample: "corresponds-to-the-CODE-generated-to-be-able-confirm-the-user-email",
                },
                url: {
                  name: "URL",
                  value: "{{= URL }}",
                  sample:
                    "is-the-Strapi-backend-URL-that-confirms-the-code-(by-default-/auth/email-confirmation)",
                },
                serverUrl: {
                  name: "SERVER_URL",
                  value: "{{= SERVER_URL }}",
                  sample: "is-the-absolute-server-url-(configured-in-server-configuration)",
                },
              },
            },
          },
        },
        mustache: {
          name: "Mustache",
          mergeTags: {
            basic: {
              name: "Basic Output",
              mergeTags: {
                raw: {
                  name: "Display Raw Content",
                  value: "{{{REPLACE_ME}}}",
                },
                output: {
                  name: "Regular Output",
                  value: "{{REPLACE_ME}}",
                },
                dottedOutput: {
                  name: "Dot notation for Output",
                  value: "{{REPLACE_ME.NESTED_VALUE}}",
                },
              },
            },
            loops: {
              name: "Loops",
              mergeTags: {
                raw: {
                  name: "Display Raw Content in Loop",
                  value: "{{#ARRAY_OR_OBJECT_TO_ITERATE}}\n{{{REPLACE_ME}}}\n{{/ARRAY_OR_OBJECT_TO_ITERATE}}",
                },
                output: {
                  name: "Regular Output in Loop",
                  value: "{{#ARRAY_OR_OBJECT_TO_ITERATE}}\n{{REPLACE_ME}}\n{{/ARRAY_OR_OBJECT_TO_ITERATE}}",
                },
                dottedOutput: {
                  name: "Dot notation for Output in Loop",
                  value:
                    "{{#ARRAY_OR_OBJECT_TO_ITERATE}}\n{{REPLACE_ME.NESTED_VALUE}}\n{{/ARRAY_OR_OBJECT_TO_ITERATE}}",
                },
              },
            },
          },
        },
      },
    }) as unknown as EmailConfig,
  // Runs after the user config is merged but before the content types are registered,
  // which is the only moment the content types can still be changed.
  validator(config: Partial<EmailConfig>) {
    if (config.enableVersioning === false) {
      disableVersioningContentTypes();
    }
  },
  /** The name of the strapi plugin
   *
   * @default "email-designer-5"
   */
  pluginName: "email-designer-5",
};
