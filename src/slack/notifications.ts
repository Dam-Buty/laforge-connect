import { slackApp } from ".";
import { config } from "../config";
import { Payload } from "../routes/incoming";

type ChatPostMessageArgument = Parameters<
  typeof slackApp.client.chat.postMessage
>[0];

export const incomingMessageNotification = (
  params: Pick<Payload, "phoneNumber" | "message">
): ChatPostMessageArgument => ({
  channel: config.slack.notificationChannel,
  text: `Message from ${params.phoneNumber} : ${params.message}`,
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `A new message was received from ${params.phoneNumber}`,
      },
    },
    {
      type: "divider",
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `${params.message}`,
      },
    },
  ],
});
