const withPlugins = require("next-compose-plugins");
const withCSS = require("@zeit/next-css");

require("dotenv").config();

module.exports = withPlugins([withCSS], {
  env: {
    SENTRY_BACKEND_DSN: process.env.SENTRY_BACKEND_DSN,
    SENTRY_FRONTEND_DSN: process.env.SENTRY_FRONTEND_DSN,
    GOOGLE_ANALYTICS_TRACKER_ID: process.env.GOOGLE_ANALYTICS_TRACKER_ID
  }
});
