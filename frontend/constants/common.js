export const backendUrl =
  process.env.NODE_ENV === "production"
    ? "https://slack-status-scheduler-257619.appspot.com"
    : "http://localhost:8080";

export const slackRedirectUrl =
  process.env.NODE_ENV === "production"
    ? "https://slackscheduler.now.sh"
    : "http://localhost:3000";
