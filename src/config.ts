export const config = {
  port: parseInt(process.env["PORT"]) || 3005,
  slack: {
    botToken: process.env["SLACK_BOT_TOKEN"],
    signingSecret: process.env["SLACK_SIGNING_SECRET"],
    appToken: process.env["SLACK_APP_TOKEN"],
    notificationChannel: process.env["SLACK_NOTIFICATION_CHANNEL"],
  },
};
