import { Document } from "mongoose";
import { OfflineMessage } from "../model/OfflineMessage";




export async function saveofflineMessages(senderId: string, receiverId: string, content: string){
    const offlinemessage=new OfflineMessage({
        senderId,
        receiverId,
        content
    })
    await offlinemessage.save()
}