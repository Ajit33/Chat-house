import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { databaseConnectionString } from "./db/config"
import V1Routes from "./routes/V1routes"
import WebSocket, { WebSocketServer } from "ws"
import http from "http"
import { string } from "zod"
import { message } from "./model/MessageModel"
const app=express()
app.use(express.json())
app.use(cors({
    credentials:true
}))
dotenv.config()

const port=process.env.PORT || 3000;

app.use("/api/v1",V1Routes)
app.get("/ping",(req,res)=>{
 res.json({
    msg:"hello ping"
 })
})

const server=http.createServer(app);
const wss=new WebSocketServer({server})
const activeUsers= new Map<string,WebSocket>() // this will map the user to the websocket server using  this we establish the connection

wss.on("connection", (socketServer, req) => {
    console.log("WebSocket connection established");
  
    socketServer.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
  
        if (message.type === "register") {
          const { userId } = message;
          if (userId) {
            activeUsers.set(userId, socketServer);
            console.log(`User ${userId} registered`);
          } else {
            console.error("Invalid register message: missing userId");
          }
        } else if (message.type === "message") {
          const { userId, receiverId, content } = message;
          const receiverSocket = activeUsers.get(receiverId);
  
          if (receiverSocket) {
            receiverSocket.send(
              JSON.stringify({ senderId: userId, message: content })
            );
          } else {
            console.log(`User ${receiverId} is offline`);
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
      for (const [userId, socket] of activeUsers.entries()) {
        if (socket === socketServer) {
          activeUsers.delete(userId);
          console.log(`User ${userId} disconnected`);
        }
      }
    });
  });

server.listen(port,async()=>{
 await databaseConnectionString()
 console.log(`application ise running on ${port}`)
})