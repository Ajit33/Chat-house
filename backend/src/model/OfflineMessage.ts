import mongoose, { Document } from "mongoose";


interface offlineMessageProps extends Document{
    senderId:String,
    receiverId:String,
    content: String,
    timestamp:Date,
    delivered:boolean
}

const offlineMessagesSchema=new mongoose.Schema<offlineMessageProps>({
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    delivered: { type: Boolean, default: false },
})
 export const OfflineMessage = mongoose.model("OfflineMessage", offlineMessagesSchema);