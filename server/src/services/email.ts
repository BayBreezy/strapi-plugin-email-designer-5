import type { Core } from "@strapi/strapi";
import decode from "decode-html";
import { htmlToText } from "html-to-text";
import _, { isEmpty } from "lodash";
import Mustache from "mustache";
import type { SendMailOptions } from "nodemailer";
import * as yup from "yup";
import configImport from "../config";

export type EmailTemplate = {
  /**
   * The subject of the email
   */
  subject: string;
  /**
   * The text version of the email
   */
  text: string;
  /**
   * The HTML version of the email
   */
  html: string;
};
export type ComposedTemplates = { html: string; text: string };

export type ComposeParams<T> = {
  templateReferenceId: number;
  data?: T;
};

// From: https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
const isValidEmail =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const isValidEmailSchema = yup.string().test("is-valid-email", "Invalid email address", (value) => {
  return isValidEmail.test(value);
});
export const isTemplateReferenceIdSchema = yup.number().required().label("Template Reference Id").min(1);

export const pluginUID = `plugin::${configImport.pluginName}.email-designer-template`;
export const pluginVersionUID = `plugin::${configImport.pluginName}.email-designer-template-version`;

export default ({ strapi }: { strapi: Core.Strapi }) => {
  const validateEmailOptions = (
    emailOptions: Pick<
      SendMailOptions,
      "to" | "from" | "bcc" | "cc" | "attachments" | "headers" | "replyTo"
    > = {}
  ) => {
    const keysToIgnore = ["attachment", "attachments", "headers"];

    // Validate email addresses
    // Only these properties are checked: to, from, bcc, cc, replyTo
    Object.entries(emailOptions).forEach(([key, address]) => {
      if (!keysToIgnore.includes(key)) {
        if (Array.isArray(address)) {
          address.forEach((email) => {
            isValidEmailSchema.validateSync(email, { abortEarly: true });
          });
        } else {
          isValidEmailSchema.validateSync(address, { abortEarly: true });
        }
      }
    });
  };

  const isEmailProviderConfigured = () => {
    const emailConfig = strapi.config.get("plugin::email") as { provider?: string } | undefined;
    const pluginEmail = strapi.plugin("email") as
      | { provider?: { send?: (...args: any[]) => any } }
      | undefined;
    const provider = pluginEmail?.provider;
    // If the provider is 'sendmail', it is not configured.
    if (emailConfig?.provider === "sendmail") return false;
    return Boolean(emailConfig?.provider && provider && typeof provider.send === "function");
  };

  /**
   * Convert Strapi's {{= ... }} unescaped syntax to Mustache's {{{ ... }}} syntax
   * Strapi templates use {{= VARIABLE }} but Mustache uses {{{ VARIABLE }}}
   */
  const convertStrapiToMustacheSyntax = (template: string): string => {
    return template.replace(/\{\{=\s*(.+?)\s*\}\}/g, "{{{$1}}}");
  };

  /**
   * Generate sample data for Strapi's core email templates
   * @param type - The type of core email ('reset-password' or 'email-confirmation')
   */
  const generateCoreEmailSampleData = (type: "reset-password" | "email-confirmation") => {
    const serverUrl = strapi.config.get("server.url") || "http://localhost:1337";

    const baseData = {
      USER: {
        username: "john_doe",
        email: "john.doe@example.com",
      },
      SERVER_URL: serverUrl,
    };

    if (type === "reset-password") {
      return {
        ...baseData,
        TOKEN: "a1b2c3d4e5f6g7h8i9j0",
        URL: `${serverUrl}/admin/auth/reset-password?code=a1b2c3d4e5f6g7h8i9j0`,
      };
    } else {
      return {
        ...baseData,
        CODE: "x1y2z3a4b5c6",
        URL: `${serverUrl}/api/auth/email-confirmation?confirmation=x1y2z3a4b5c6`,
      };
    }
  };

  /**
   * Render email headers with Mustache templating and custom lambdas
   * Supports {{variable}} syntax and helper functions like {{urlEncode variable}}
   * @param headers - Headers object which may contain template variables
   * @param data - Data object to pass to Mustache for variable rendering
   * @returns Rendered headers with variables replaced by data values
   */
  const renderHeaders = <T extends Record<string, any>>(headers: any, data: T = {} as T): any => {
    if (!headers) return undefined;

    // Create a data object with helper functions for Mustache lambdas
    const renderData = {
      ...data,
      // Helper lambda for URL encoding
      urlEncode: function () {
        return function (text: string, render: (t: string) => string) {
          const rendered = render(text.trim());
          return encodeURIComponent(rendered);
        };
      },
    };

    const renderedHeaders: Record<string, any> = {};

    Object.entries(headers).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle array of header values
        renderedHeaders[key] = value.map((v: any) => {
          if (typeof v === "string") {
            return Mustache.render(v, renderData);
          }
          return v;
        });
      } else if (typeof value === "string") {
        // Handle single header value
        renderedHeaders[key] = Mustache.render(value, renderData);
      } else {
        // Pass through non-string values (e.g., Nodemailer header objects)
        renderedHeaders[key] = value;
      }
    });

    return renderedHeaders;
  };

  /**
   * fill subject, text and html using lodash template
   * @param {SendMailOptions} emailOptions
   * @param {EmailTemplate} emailTemplate
   * @param {object} data - data used to fill the template
   */
  const sendTemplatedEmail = async <T extends Record<string, any>>(
    emailOptions: Pick<
      SendMailOptions,
      "to" | "from" | "bcc" | "cc" | "attachments" | "headers" | "replyTo"
    > = {},
    emailTemplate?: Partial<EmailTemplate> & { templateReferenceId: number },
    data: T = {} as T
  ) => {
    validateEmailOptions(emailOptions);

    // check if emailTemplate is valid
    isTemplateReferenceIdSchema.validateSync(emailTemplate.templateReferenceId, { abortEarly: true });
    const attributes = ["text", "html", "subject"];

    const { templateReferenceId } = emailTemplate;

    // const response = await strapi.db
    //   .query("plugin::email-designer.email-template")
    //   .findOne({ where: { templateReferenceId } });
    const response = await strapi.db.query(pluginUID).findOne({ where: { templateReferenceId } });

    if (!response) {
      strapi.log.error(`No email template found with referenceId "${templateReferenceId}"`);
      return null;
    }
    let bodyHtml = "";
    let bodyText = "";
    let subject = "";

    ({ bodyHtml, bodyText, subject } = response);
    // Replace <% and %> with {{ and }} to maintain compatibility with legacy templates
    bodyHtml = bodyHtml.replace(/<%/g, "{{").replace(/%>/g, "}}");
    bodyText = bodyText.replace(/<%/g, "{{").replace(/%>/g, "}}");
    subject = subject.replace(/<%/g, "{{").replace(/%>/g, "}}");

    // Convert Strapi's {{= ... }} unescaped syntax to Mustache's {{{ ... }}}
    bodyHtml = convertStrapiToMustacheSyntax(bodyHtml);
    bodyText = convertStrapiToMustacheSyntax(bodyText);
    subject = convertStrapiToMustacheSyntax(subject);

    // If no text is provided, convert html to text
    if ((!bodyText || !bodyText.length) && bodyHtml && bodyHtml.length) {
      bodyText = htmlToText(bodyHtml, { wordwrap: 130 });
    }

    emailTemplate = {
      ...emailTemplate,
      subject:
        (!isEmpty(emailTemplate.subject) && emailTemplate.subject) ||
        (!isEmpty(subject) && decode(subject)) ||
        "No Subject",
      html: decode(bodyHtml),
      text: decode(bodyText),
    };

    const templatedAttributes = attributes.reduce(
      (compiled, attribute) =>
        emailTemplate[attribute]
          ? Object.assign(compiled, { [attribute]: Mustache.render(emailTemplate[attribute], data) })
          : compiled,
      {}
    );

    // Render headers with template data for dynamic values
    const renderedHeaders = renderHeaders(emailOptions.headers, data);
    const finalEmailOptions = {
      ...emailOptions,
      ...(renderedHeaders && { headers: renderedHeaders }),
    };

    return strapi.plugin("email").provider.send({ ...finalEmailOptions, ...templatedAttributes });
  };

  const sendTestEmail = async <T extends Record<string, any>>(
    emailOptions: Pick<SendMailOptions, "to" | "headers">,
    content: { subject?: string; html?: string; text?: string },
    data: T = {} as T
  ) => {
    if (!isEmailProviderConfigured()) {
      throw new Error("Email provider not configured");
    }

    validateEmailOptions(emailOptions);

    let subject = content.subject || "No Subject";
    let bodyHtml = content.html || "";
    let bodyText = content.text || "";

    // Replace <% and %> with {{ and }} to maintain compatibility with legacy templates
    bodyHtml = bodyHtml.replace(/<%/g, "{{").replace(/%>/g, "}}");
    bodyText = bodyText.replace(/<%/g, "{{").replace(/%>/g, "}}");
    subject = subject.replace(/<%/g, "{{").replace(/%>/g, "}}");

    // Convert Strapi's {{= ... }} unescaped syntax to Mustache's {{{ ... }}}
    bodyHtml = convertStrapiToMustacheSyntax(bodyHtml);
    bodyText = convertStrapiToMustacheSyntax(bodyText);
    subject = convertStrapiToMustacheSyntax(subject);

    if ((!bodyText || !bodyText.length) && bodyHtml && bodyHtml.length) {
      bodyText = htmlToText(bodyHtml, { wordwrap: 130 });
    }

    const renderedSubject = Mustache.render(decode(subject), data);
    const renderedHtml = Mustache.render(decode(bodyHtml), data);
    const renderedText = Mustache.render(decode(bodyText), data);

    // Render headers with template data for dynamic values
    const renderedHeaders = renderHeaders(emailOptions.headers, data);
    const finalEmailOptions = {
      to: emailOptions.to,
      ...(renderedHeaders && { headers: renderedHeaders }),
    };

    return strapi.plugin("email").provider.send({
      ...finalEmailOptions,
      subject: renderedSubject,
      html: renderedHtml,
      text: renderedText,
    });
  };

  /**
   * Promise to retrieve a composed HTML email.
   * @return {Promise}
   */
  const compose = async <T extends Record<string, any>>({ templateReferenceId, data }: ComposeParams<T>) => {
    // check if templateReferenceId is valid
    isTemplateReferenceIdSchema.validateSync(templateReferenceId, { abortEarly: true });

    let res = await strapi.db.query(pluginUID).findOne({ where: { templateReferenceId } });
    if (!res) {
      throw new Error(`No email template found with referenceId "${templateReferenceId}"`);
    }
    let { bodyHtml = "", bodyText = "", subject = "" } = res;

    // Replace <% and %> with {{ and }} to maintain compatibility with legacy templates
    bodyHtml = bodyHtml.replace(/<%/g, "{{").replace(/%>/g, "}}");
    bodyText = bodyText.replace(/<%/g, "{{").replace(/%>/g, "}}");
    subject = subject.replace(/<%/g, "{{").replace(/%>/g, "}}");

    // Convert Strapi's {{= ... }} unescaped syntax to Mustache's {{{ ... }}}
    bodyHtml = convertStrapiToMustacheSyntax(bodyHtml);
    bodyText = convertStrapiToMustacheSyntax(bodyText);
    subject = convertStrapiToMustacheSyntax(subject);

    if ((!bodyText || !bodyText.length) && bodyHtml && bodyHtml.length) {
      bodyText = htmlToText(bodyHtml, { wordwrap: 130 });
    }

    const emailTemplate: ComposedTemplates = {
      html: decode(bodyHtml),
      text: decode(bodyText),
    };

    const attributes = ["text", "html"];
    const templatedAttributes: ComposedTemplates = attributes.reduce(
      (compiled, attribute) =>
        emailTemplate[attribute]
          ? Object.assign(compiled, { [attribute]: Mustache.render(emailTemplate[attribute], data) })
          : compiled,
      {} as ComposedTemplates
    );

    return {
      composedHtml: templatedAttributes.html,
      composedText: templatedAttributes.text,
    };
  };

  return {
    sendTemplatedEmail,
    sendTestEmail,
    isEmailProviderConfigured,
    generateCoreEmailSampleData,
    renderHeaders,
    convertStrapiToMustacheSyntax,
    compose,
  };
};
