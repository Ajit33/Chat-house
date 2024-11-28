import express from "express"
import { signoutController, signupController, signinController } from "../controller/authController"

const route=express.Router()

route.post("/signup",signupController)
route.post("/signin" ,signinController)
route.get("/signout",signoutController)

export default route;