import { associateThread, identifyThread } from "../prisma";
import { Payload } from "../routes/incoming";
import { slackApp } from "../slack";
import {
  newMessageInThreadNotification,
  newThreadNotification,
} from "../slack/notifications";

export async function pipeIncomingMessage(
  payload: Pick<Payload, "phoneNumber" | "message">
) {
  const { phoneNumber, message } = payload;

  const thread = await identifyThread(phoneNumber);

  if (!thread) {
    const res = await slackApp.client.chat.postMessage(
      newThreadNotification({ phoneNumber, message })
    );

    const threadId = res.ts;

    await associateThread(phoneNumber, threadId);
  } else {
    await slackApp.client.chat.postMessage(
      newMessageInThreadNotification({
        phoneNumber,
        message,
        threadId: thread.threadId,
      })
    );
  }
}
