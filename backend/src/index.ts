import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { databaseConnectionString } from "./db/config"
import V1Routes from "./routes/V1routes"
const app=express()
app.use(express.json())
app.use(cors({
    credentials:true
}))
dotenv.config()

const port=process.env.PORT;

app.use("/api/v1",V1Routes)
app.get("/ping",(req,res)=>{
 res.json({
    msg:"hello ping"
 })
})



app.listen(port,async()=>{
 await databaseConnectionString()
 console.log(`application ise running on ${port}`)
})