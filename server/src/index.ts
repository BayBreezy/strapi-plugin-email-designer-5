/**
 * Application methods
 */
import bootstrap from "./bootstrap";
/**
 * Plugin server methods
 */
import config from "./config";
import contentTypes from "./content-types";
import controllers from "./controllers";
import destroy from "./destroy";
import middlewares from "./middlewares";
import policies from "./policies";
import register from "./register";
import routes from "./routes";
import services from "./services";

export type { EmailConfig } from "./config";

export default {
  register,
  bootstrap,
  destroy,
  config,
  controllers,
  routes,
  services,
  contentTypes,
  policies,
  middlewares,
};
