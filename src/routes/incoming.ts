import { RequestHandler } from "express";
import { pipeIncomingMessage } from "../services/pipe-incoming-message";

export type Payload = { phoneNumber: string; message: string };

export const incomingMessageHandler: RequestHandler = async (req, res) => {
  const payload = req.body.payload as Payload;
  const { phoneNumber, message } = payload;

  if (!phoneNumber || !message) {
    res.status(400).json({
      message: "Payload must contain phoneNumber and message",
    });
  }

  try {
    res.status(200).end();

    await pipeIncomingMessage({ phoneNumber, message });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
};
