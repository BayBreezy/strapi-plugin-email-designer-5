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

export default ({ strapi }: { strapi: Core.Strapi }) => {
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
    return strapi.plugin("email").provider.send({ ...emailOptions, ...templatedAttributes });
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
    compose,
  };
};
