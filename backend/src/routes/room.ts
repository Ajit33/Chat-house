
import express from "express"
import { getAllRoomsController } from "../controller/roomController"
const route=express.Router()

route.get("/",getAllRoomsController)



export default route