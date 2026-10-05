<img src="./Email%20Designer%20Logo.jpg" alt="Strapi Email Designer logo" width="70" height="70" style="border-radius: 12px;" />

# <img src="./Email%20Designer%20Logo.jpg" alt="" width="26" height="26" style="border-radius: 4px;" /> Strapi Email Designer (v5)

Design your own email templates directly from the Strapi admin panel and use the magic to send programmatically email from your controllers / services.

![Screenshot of an imported design](./imgs/design.jpeg)

- [ Strapi Email Designer (v5)](#-strapi-email-designer-v5)
  - [❤️ Credits](#️-credits)
  - [💸 Support Me](#-support-me)
  - [⚙️ Version](#️-version)
  - [✅ Prerequisites](#-prerequisites)
  - [⬇️ Installation](#️-installation)
  - [🎚️ Middleware Configuration](#️-middleware-configuration)
    - [☁️ Strapi Cloud](#️-strapi-cloud)
  - [🎚️ Plugin Configuration](#️-plugin-configuration)
    - [📧 Nodemailer](#-nodemailer)
    - [⚙️ Default configuration](#️-default-configuration)
    - [🕓 Template versioning](#-template-versioning)
  - [▶️ Usage](#️-usage)
    - [✅ Creating a new design](#-creating-a-new-design)
    - [✅ Importing a design](#-importing-a-design)
    - [✅ Exporting a design](#-exporting-a-design)
    - [✅ Importing a Single Design](#-importing-a-single-design)
    - [✅ Saving a design](#-saving-a-design)
    - [✅ Test Sending an Email](#-test-sending-an-email)
  - [{ } Mustache](#--mustache)
  - [💻 Programmatically Sending Emails](#-programmatically-sending-emails)
  - [🚀 Available Services](#-available-services)
    - [✅ Email Services](#-email-services)
      - [`sendTemplatedEmail`](#sendtemplatedemail)
      - [`compose`](#compose)
  - [🛟 Contributing](#-contributing)
  - [✍🏽 License](#-license)
  - [🎆 Images](#-images)

## ❤️ Credits

Special thanks to:

- [Unlayer](https://unlayer.com/) for the amazing email editor
- [Strapi Plugin Email Designer](https://github.com/alexzaganelli/strapi-plugin-email-designer) for doing the heavy lifting for v3 and v4

## 💸 Support Me

If you can 😊

<a href="https://buymeacoffee.com/llehXIrI8g" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important" ></a>

## ⚙️ Version

This plugin is compatible with Strapi v5.

How plugins are structured in v5 is way different than v4, so I am not trying to make this plugin compatible with v4. Use the [Email Designer plugin here](https://github.com/alexzaganelli/strapi-plugin-email-designer) for v4.

## ✅ Prerequisites

- Node v20+ (I recommend using [nvm](https://github.com/nvm-sh/nvm), there is a windows and mac/linux version)
- A Strapi v5 project (`npx create-strapi-app@latest my-project`)

## ⬇️ Installation

Install the plugin by runnig the following command:

```bash
npm install strapi-plugin-email-designer-5
```

## 🎚️ Middleware Configuration

By default, Strapi's security is tight. You will need to add the following to your `config/middlewares.ts` file:

```ts
{
  name: "strapi::security",
  config: {
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'", "'unsafe-inline'", "editor.unlayer.com"],
        "frame-src": ["'self'", "editor.unlayer.com"],
        upgradeInsecureRequests: null,
      },
    },
  },
}
```

Ensure that you replace the `"strapi::security"` line in the file with the above.

### ☁️ Strapi Cloud

On [Strapi Cloud](https://docs.strapi.io/cloud/advanced/middlewares), `NODE_ENV` is always `production` and the platform overwrites the global `config/middlewares` file on deploy, so the change above will have no effect and the editor will be blocked with an error like `Loading the script 'https://editor.unlayer.com/embed.js?2' violates the following Content Security Policy directive: "script-src 'self'"`.

Put the change in `config/env/production/middlewares.ts` (or `.js`) instead. This file **fully replaces** the global middleware array, so it must list every default middleware, not just `strapi::security`:

```ts
export default [
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "script-src": ["'self'", "'unsafe-inline'", "editor.unlayer.com"],
          "frame-src": ["'self'", "editor.unlayer.com"],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
```

You can keep your existing `config/middlewares` file as it is, the production file takes precedence on Strapi Cloud. Redeploy after committing the change. See the [Strapi Cloud middleware docs](https://docs.strapi.io/cloud/advanced/middlewares#custom-content-security-policy-csp) for details.

## 🎚️ Plugin Configuration

The plugin configuration accepts most of the properties that can be passed to the Unlayer editor. You can get more information about them here: https://docs.unlayer.com/docs/getting-started#configuration-options

Important: Unlayer has paid features (for example, custom fonts) that require a paid plan. See the Unlayer docs for details: https://docs.unlayer.com/builder/installation

This is the type definition for the configuration:

```ts
import type { EmailEditorProps } from "react-email-editor";

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
>;
```

### 📧 Nodemailer

If you are going to send emails from the Strapi backend, you need to configure the email plugin. You can visit the docs [here](https://github.com/strapi/strapi/tree/main/packages/providers/email-nodemailer) to learn more

```bash
npm install @strapi/provider-email-nodemailer --save
```

### ⚙️ Default configuration

Some options are passed by default to the editor. Expand the following object to see the default configuration:

<details>
<summary style="font-weight: bold">Default configuration</summary>

```ts
{
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
        // Values that can be used in the Email Addres Confirmation context
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
}
```

</details>

<br/>

If you wish to pass in any configuration, you can do so in the `config/plugins.ts` file. Here is an example of how to pass in a custom configuration:

```ts
// You can import the EmailConfig type from the plugin
import type { EmailConfig } from "strapi-plugin-email-designer-5/dist/server/src";

export default ({ env }) => ({
  // You need Email configured if you are gonna send emails from the Strapi backend
  // This is a simple configuration for development using MailDev
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: "0.0.0.0",
        port: 1025,
        ignoreTLS: true,
      },
    },
  },
  // This is the configuration for the Email Designer plugin
  "email-designer-5": {
    enabled: true,
    // Your custom configuration here
    config: {
      // Here the Merge Tags defined will be merged with the defaults above
      mergeTags: {
        company: {
          name: "Company",
          mergeTags: {
            name: {
              name: "Company Name",
              value: "ACME Corp",
              sample: "ACME Corp",
            },
          },
        },
      },
    } as EmailConfig,
  },
});
```

### 🕓 Template versioning

Every time a template's design, name or subject changes, the plugin stores a version of it that you can compare and restore from the **History** tab. Versioning is enabled by default. If you don't need it, you can turn it off with the `enableVersioning` option:

```ts
export default ({ env }) => ({
  "email-designer-5": {
    enabled: true,
    config: {
      enableVersioning: false,
    },
  },
});
```

When disabled, the version content type is not registered, no versions are saved, the History tab is hidden and the `/versions` routes return a 404.

> [!WARNING]
> Strapi removes the database table of a content type that is no longer registered. Setting `enableVersioning` to `false` on an existing project **permanently deletes the stored version history** the next time Strapi starts. Turning it back on later creates a new, empty history.

## ▶️ Usage

After installing & configuring your app for the plugin, you can access the email designer by navigating to the `Email Designer (v5)` section in the admin panel.

![Admin Area](./imgs/custom.png)

### ✅ Creating a new design

Click on the `Create a new email` button to start a new design.

### ✅ Importing a design

You can import a set of designs that were exported by the platform by clicking on the `Import Email Templates` button located at the bottom right of the page.

### ✅ Exporting a design

You can export all your designs by clicking the `Export Email Templates` button located at the bottom right of the page.

### ✅ Importing a Single Design

When you start a new design, a button will be located in the top right called `Import` that allows you to import a single design. If the json file is valid Unlayer exported design, it will be imported into the editor.

### ✅ Saving a design

Once you are done editing your design, you can click on the `Save` button located at the top right of the page. The `Template Reference ID`, `Template Name`, & `Subject` fields are required to save the design.(Well not the last two lol)

The `Template Reference ID` is a unique identifier for the design. It is used to reference the design when sending emails programmatically.

### ✅ Test Sending an Email

You can test your email templates directly from the designer before using them in your application. While editing a template on the HTML tab, you'll find a `Test Send` button in the top right action menu (alongside the Import button).

**Opening the Test Send Modal:**

1. Click the `Test Send` button (paper plane icon) in the top right of the designer
2. A modal will open with fields for recipient email and optional custom data

**Test Send Modal Fields:**

- **To Email** (required): The email address where the test email will be sent
- **Data (JSON)** (optional): Custom JSON data to merge into your template variables. If left empty, the template will render without custom data.

**Using Sample Data for Core Templates:**
If you're testing core Strapi email templates (reset-password or email-confirmation), the modal provides quick-load buttons:

- **Load Reset Password Data**: Populates the data field with sample variables used in password reset emails (USER, TOKEN, URL, SERVER_URL)
- **Load Email Confirmation Data**: Populates the data field with sample variables used in email confirmation (USER, CODE, URL, SERVER_URL)

These buttons provide realistic mock data so you can see exactly how your template will render with actual Strapi variables.

**Sending a Test Email:**

1. Enter the recipient email address
2. (Optional) Provide custom JSON data or click a sample data button
3. Click the `Send` button
4. The template will render with your data and send to the specified email address

> [!NOTE]
> Test sending requires that your email provider is properly configured in your Strapi instance. The modal will display a status message indicating whether email is configured and ready to use.

## { } Mustache

The backend uses Mustache to render the templates. You can visit the [Mustache documentation](https://mustache.github.io/mustache.5.html) to learn more about how to use it.

## 💻 Programmatically Sending Emails

You can send emails programmatically by using the `email-designer-5` plugin. Here is an example of how to send an email:

> [!IMPORTANT]  
> This is tested the `index.ts` file of the `src` folder of my strapi project.

```ts
// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {
    try {
      await strapi
        .plugin("email-designer-5")
        .service("email")
        .sendTemplatedEmail(
          {
            // required
            // This can also be an array of email addresses
            to: "to@example.com",
            // Optional
            cc: ["zez@jakce.ad", "ilez@gevcanuso.la"],
            // Optional
            bcc: ["fud@darfuv.py"],
            // optional if /config/plugins.js -> email.settings.defaultFrom is set
            from: "from@example.com",
            // optional if /config/plugins.js -> email.settings.defaultReplyTo is set
            replyTo: "reply@example.com",
            // optional array of files
            attachments: [],
          },
          {
            // required - Ref ID defined in the template designer (won't change on import)
            templateReferenceId: 20,
            // If provided here will override the template's subject.
            // Can include variables like `Thank you for your order {{= USER.firstName }}!`
            subject: `Thank you for your order`,
          },
          {
            // this object must include all variables you're using in your email template
            USER: { firstName: "John", lastName: "Doe" },
            order: {
              products: [
                { name: "Article 1", price: 9.99 },
                { name: "Article 2", price: 5.55 },
              ],
            },
            shippingCost: 5,
            total: 20.54,
          }
        );
      strapi.log.info("Email sent");
    } catch (error) {
      strapi.log.error(error);
    }
  },
};
```

This is what the email looked like in the MailDev client

![MailDev Test Results](./imgs/test-results.jpeg)

## 🚀 Available Services

Here is a list of the services that the plugin provides. You can call upon them in your controllers or services(or wherever you want).

### ✅ Email Services

#### `sendTemplatedEmail`

You will probably use this one a lot.

```ts
await strapi
  .plugin("email-designer-5")
  .service("email")
  .sendTemplatedEmail(EMAIL_OPTIONS_OBJECT, EMAIL_TEMPLATE_OBJECT, DATA);
```

#### `compose`

I didn't get why this service was deprecated in the original plugin, but i found it useful for sending PDF data to my frontend.

```ts
await strapi.plugin("email-designer-5").service("email").compose({ templateReferenceId, data });
```

This returns the email HTML and Text with the data merged.

```ts
{
  html: "<html>...</html>",
  text: "..."
}
```

### 📧 Dynamic Headers with Variables

Email headers can now include template variables from your data object. This is particularly useful for mailing list compliance (List-Unsubscribe header), tracking, and other dynamic scenarios.

**How It Works:**
When you pass variables in the `data` parameter of `sendTemplatedEmail()`, they are automatically available in the `headers` section. Simply use `{{variableName}}` syntax to reference them.

**Before - Static Headers (No Variables):**

```ts
// ❌ Old way - headers were always static, same for every email
await strapi
  .plugin("email-designer-5")
  .service("email")
  .sendTemplatedEmail(
    {
      to: "user@example.com",
      headers: {
        // This unsubscribe link is the same for everyone - not useful!
        "List-Unsubscribe": "<mailto:unsubscribe@example.com>, <https://example.com/unsubscribe>",
      },
    },
    { templateReferenceId: 20 },
    {
      /* data */
    }
  );
```

**After - Dynamic Headers with Variables (New!):**

```ts
// ✅ New way - use variables from data object in headers
const user = {
  id: 456,
  email: "john@example.com",
  unsubscribeToken: "xyz789abc",
};

await strapi
  .plugin("email-designer-5")
  .service("email")
  .sendTemplatedEmail(
    {
      to: user.email,
      headers: {
        // Now the unsubscribe link is personalized for each user! 🚀
        "List-Unsubscribe":
          "<mailto:unsubscribe@example.com>, <https://example.com/unsubscribe?user={{id}}&token={{urlEncode unsubscribeToken}}>",
        "X-User-ID": "{{id}}",
        "X-Campaign": "{{campaignName}}",
      },
    },
    { templateReferenceId: 20, subject: "Hello {{name}}" },
    {
      // These variables are automatically available in the headers section above ⬆️
      id: user.id,
      email: user.email,
      name: user.name,
      unsubscribeToken: user.unsubscribeToken,
      campaignName: "monthly-newsletter",
    }
  );

// 📨 Result: Each user gets a unique unsubscribe link in their email headers:
// User 456: <mailto:unsubscribe@example.com>, <https://example.com/unsubscribe?user=456&token=xyz789abc>
// User 789: <mailto:unsubscribe@example.com>, <https://example.com/unsubscribe?user=789&token=def456ghi>
// etc...
```

**Header Template Syntax:**

- `{{variableName}}` - Insert variables with HTML escaping
- `{{{variableName}}}` - Insert variables without escaping
- `{{urlEncode variableName}}` - URL encode a variable for use in query parameters (useful for List-Unsubscribe URLs)
- `{{#ifCondition}}...{{/ifCondition}}` - Conditionals (Mustache syntax)
- `{{#arrayName}}...{{/arrayName}}` - Loops (Mustache syntax)

**Use Cases:**

- **Mailing List Compliance**: Add personalized unsubscribe links with user-specific tokens
- **Email Tracking**: Include user IDs and campaign identifiers in custom headers
- **Analytics**: Add timestamps and user information to email metadata
- **Support Routing**: Create user-specific reply-to addresses

## 🛟 Contributing

I am SUPER new to React. I have been using Nuxt all my life. If you see where I could have done something better in the admin area, please let me know. I am open to suggestions.

Just fork the repo, make your changes, and submit a PR. I will review it as soon as I can. I am open to learning new things.

## ✍🏽 License

MIT

I mean, I am not the original author of the plugin. I just made it compatible with Strapi v5. So, I am not sure if I can license it. But, I will keep it MIT for now.

## 🎆 Images

Image of the Core Tab in the Admin UI

![Image of the Core Tab in the Admin UI](imgs/core.png)

Image of the Custom Email Tab in the Admin UI

![Image of the Custom Email Tab in the Admin UI](imgs/custom.png)

Image of the Editor wit imported design

![Image of the Editor wit imported design](imgs/design.jpeg)

Image of Email in MailDev

![Image of Email in MailDev](imgs/test-results.jpeg)

Image of the Version Compare Modal

![Image of the Version Compare Modal](imgs/diff.png)
