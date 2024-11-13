import mongoose, { Document } from "mongoose"
import { string } from "zod";

interface UserProps extends Document{
   userName:string,
   email:string,
   password:string,
   activeStatus:boolean,
   avatar?:string
}

const userSchema = new mongoose.Schema<UserProps>({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
});
export const User=mongoose.model<UserProps>("user",userSchema);