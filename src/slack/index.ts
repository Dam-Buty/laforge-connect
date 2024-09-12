import { App as SlackApp } from "@slack/bolt";
import { initSlackEvents } from "./events";
import { config } from "../config";

export let slackApp: SlackApp;

try {
  slackApp = new SlackApp({
    token: config.slack.botToken,
    signingSecret: config.slack.signingSecret,
    socketMode: true,
    appToken: config.slack.appToken,
  });
} catch (error) {
  console.error(
    "⚠️ Slack app could not be started probably due to missing configuration. Please check the environment variables."
  );
}

export const initSlackApp = async () => {
  await initSlackEvents(slackApp);
  await slackApp.start();

  console.log("⚡️ Slack app is listening!");
};
