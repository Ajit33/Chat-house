import { Document } from "mongoose";
import { OfflineMessage } from "../model/OfflineMessage";
import { Request, Response } from "express";
import { message } from "../model/MessageModel";
import messageEmiter from "../lib/event";

export async function saveofflineMessages(
  senderId: string,
  receiverId: string,
  content: string
) {
  const offlinemessage = new OfflineMessage({
    senderId,
    receiverId,
    content,
  });
  await offlinemessage.save();
}

export async function sendMessage(req: Request, res: Response): Promise<void> {
  const { content, receiverId, senderId, roomId } = req.body;

  try {
    if (!content || !senderId) {
      res.status(400).json({
        error: "Content and senderId are required.",
      });
      return;
    }

    if (!receiverId && !roomId) {
      res.status(400).json({
        error:
          "Either receiverId (for one-to-one) or roomId (for group) is required.",
      });
      return;
    }

    const newMessage = new message({
      content,
      senderId,
      receiverId: receiverId || null,
      roomId: roomId || null,
    });

    const savedMessage = await newMessage.save();
   messageEmiter.emit("newMessage", { senderId, content, roomId, receiverId })
    res.status(201).json({
      message: "Message sent successfully.",
      data: savedMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);

    res.status(500).json({
      error: "An unexpected error occurred while sending the message.",
    });
  }
}
