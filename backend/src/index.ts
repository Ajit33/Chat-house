import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { databaseConnectionString } from "./db/config";
import V1Routes from "./routes/V1routes";
import WebSocket, { WebSocketServer } from "ws";
import http from "http";
import { string } from "zod";
import { message } from "./model/MessageModel";
import { OfflineMessage } from "./model/OfflineMessage";
import { saveofflineMessages } from "./controller/messageController";
import { room } from "./model/RoomModel";
import { set } from "mongoose";
const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
  })
);
dotenv.config();

const port = process.env.PORT || 3000;

app.use("/api/v1", V1Routes);
app.get("/ping", (req, res) => {
  res.json({
    msg: "hello ping",
  });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const activeUsers = new Map<string, WebSocket>(); // Maps user IDs to WebSocket instances
const activeGroups = new Map<string, Set<WebSocket>>(); // Maps room IDs to Sets of WebSocket connections
wss.on("connection", (socketServer, req) => {
  console.log("WebSocket connection established");

  socketServer.on("message", async (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === "register") {
        const { userId } = message;
        if (userId) {
          activeUsers.set(userId, socketServer);
          console.log(`User ${userId} registered`);
        
        const hasOfflineMessages= await OfflineMessage.find({receiverId:userId,delivered:false});
        if(hasOfflineMessages.length>0){
          hasOfflineMessages.forEach((message)=>{
              socketServer.send( JSON.stringify({
                senderId: message.senderId,
                content: message.content,
              }))
          })
        }
        await OfflineMessage.updateMany({receiverId:userId,delivered:false}, {$set:{delivered:true}})
        }
      } else if (message.type === "one-to-one") {
        const { senderId, receiverId, content } = message;
        const receiverSocket = activeUsers.get(receiverId);

        if (receiverSocket) {
          receiverSocket.send(
            JSON.stringify({ senderId:senderId , message: content })
          );
        } else {
          await saveofflineMessages(senderId, receiverId, content);
          console.log(`User ${receiverId} is offline`);
        }
      } else if (message.type === "join-room") {
        const { roomId, userId } = message;

        // Add user to room
        if (!activeGroups.has(roomId)) {
          activeGroups.set(roomId, new Set<WebSocket>());
        }
        activeGroups.get(roomId)?.add(socketServer);

        // Add user to MongoDB room
        const roomData = await room.findOneAndUpdate(
          { name: roomId },
          { $addToSet: { members: userId } },
          { upsert: true, new: true }
        );
        console.log(`User ${userId} joined room ${roomId}`, roomData);
      } else if (message.type === "group-message") {
        const { roomId, senderId, content } = message;

        // Save message to MongoDB
        // await message.create({
        //   senderId,
        //   content,
        //   roomId,
        // });

        // Broadcast message to all users in the room
        const roomMembers = activeGroups.get(roomId);
        if (roomMembers) {
          for (const memberSocket of roomMembers) {
            if (memberSocket !== socketServer) {
              memberSocket.send(
                JSON.stringify({ type: "group-message", senderId, content })
              );
            }
          }
        }
      } else {
        console.log("Unknown message type:", message.type);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  socketServer.on("close", () => {
    console.log("WebSocket connection closed");

    // Remove user from activeUsers
    for (const [userId, socket] of activeUsers.entries()) {
      if (socket === socketServer) {
        activeUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    }

    // Remove user from activeGroups
    for (const [roomId, members] of activeGroups.entries()) {
      if (members.has(socketServer)) {
        members.delete(socketServer);
        if (members.size === 0) {
          activeGroups.delete(roomId); // Cleanup empty rooms
        }
      }
    }
  });
});


server.listen(port, async () => {
  await databaseConnectionString();
  console.log(`application ise running on ${port}`);
});
