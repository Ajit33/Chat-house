import express from "express"
import { signupController } from "../controller/authControoler"

const route=express.Router()

route.post("/signup",signupController)
route.post("/signin")
route.get("/signout")

export default route;