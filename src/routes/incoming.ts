import { RequestHandler } from "express";
import { pipeIncomingMessage } from "../services/pipe-incoming-message";

export type Payload = { phoneNumber: string; message: string };

/**
 * TODO : adapt this to the payloads sent by WhatsApp / Twilio
 * documentation :
 * - https://www.twilio.com/docs/messaging/tutorials/how-to-receive-and-reply/node-js
 * - https://developers.facebook.com/docs/whatsapp/webhooks/
 */
export const incomingMessageHandler: RequestHandler = async (req, res) => {
  const payload = req.body.payload as Payload;
  const { phoneNumber, message } = payload;

  if (!phoneNumber || !message) {
    res.status(400).json({
      message: "Payload must contain phoneNumber and message",
    });
  }

  try {
    await pipeIncomingMessage({ phoneNumber, message });
    res.status(200).end();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
};
