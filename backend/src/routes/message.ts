import express from "express"
import { sendMessage } from "../controller/messageController";
const route=express.Router();

route.post("/send",sendMessage)


export default route;