import { App as SlackApp } from "@slack/bolt";
import { identifyPhoneNumber } from "../prisma";
import { sendResponse } from "../services/send-response";

export const initSlackEvents = (slackApp: SlackApp) => {
  slackApp.message(async ({ message }) => {
    const threadId = (message as any).thread_ts;
    const response = (message as any).text;

    if (!threadId) {
      return;
    }

    const association = await identifyPhoneNumber(threadId);

    if (!association) {
      return;
    }

    await sendResponse(association.phoneNumber, response);
  });
};
