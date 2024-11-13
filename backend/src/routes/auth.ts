import express from "express"
import { signoutController, signupController, sininController } from "../controller/authControoler"

const route=express.Router()

route.post("/signup",signupController)
route.post("/signin" ,sininController)
route.get("/signout",signoutController)

export default route;