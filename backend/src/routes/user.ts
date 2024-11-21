
import express from "express"
import { findUserController, getUserController } from "../controller/userController"
const route =express.Router()

route.get("/search",findUserController)
route.get("/",getUserController)

export default route