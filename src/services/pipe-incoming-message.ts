import { associateThread, identifyThread } from "../prisma";
import { Payload } from "../routes/incoming";
import { slackApp } from "../slack";
import { incomingMessageNotification } from "../slack/notifications";

export async function pipeIncomingMessage(
  payload: Pick<Payload, "phoneNumber" | "message">
) {
  const { phoneNumber, message } = payload;

  const thread = await identifyThread(phoneNumber);

  if (!thread) {
    const res = await slackApp.client.chat.postMessage(
      incomingMessageNotification({ phoneNumber, message })
    );

    const { ts } = res;

    await associateThread(phoneNumber, ts);
  } else {
    await slackApp.client.chat.postMessage({
      ...incomingMessageNotification({ phoneNumber, message }),
      thread_ts: thread.threadId,
    });
  }
}
