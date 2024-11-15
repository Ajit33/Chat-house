

import mongoose, { Document } from "mongoose"
import { number } from "zod"

interface messageProps extends Document {
    senderId:string,
    content:string,
    timeStamp:Date,
    roomId?:string,
    upvote?:number,
    reciverId?:string,
}

const messageSchema= new mongoose.Schema<messageProps>({
    senderId:{type:String, required:true},
   content:{type:String, required:true},
   timeStamp:{type:Date,default:Date.now()},
   roomId:{type:String, default:null},
   upvote:{type:Number,default:0},
   reciverId:{type:String,default:null}
})

export const message=mongoose.model<messageProps>("message",messageSchema)