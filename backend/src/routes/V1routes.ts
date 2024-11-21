import express from "express"
const route=express.Router()
import auth from "./auth"
import message from "./message"
import room from "./room"
import user from "./user"

  route.use("/auth",auth)
  route.use("/message",message)
  route.use("/room",room)
  route.use("/user",user)
  export default route;
