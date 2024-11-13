import express from "express"
  const route=express.Router()
import auth from "./auth"
  route.use("/auth",auth)
  
  export default route;
