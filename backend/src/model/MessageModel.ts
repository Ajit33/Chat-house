

import mongoose, { Document } from "mongoose"
import { number } from "zod"

interface messageProps extends Document {
    sender:string,
    content:string,
    timeStamp:Date,
    roomId?:string,
    upvote?:number,
    reciver?:string,
}

const messageSchema= new mongoose.Schema<messageProps>({
   sender:{type:String, required:true},
   content:{type:String, required:true},
   timeStamp:{type:Date,default:Date.now()},
   roomId:{type:String, default:null},
   upvote:{type:Number,default:0},
   reciver:{type:String,default:null}
})

export const message=mongoose.model<messageProps>("message",messageSchema)