import express, { Request, Response } from "express"
import { User } from "../model/Usermodel"
import bcrypt from "bcrypt"
import { message } from "../model/MessageModel"

 export const signupController= async(req:Request,res:Response):Promise<void>=>{
   try {
    const{userName,password,email}=req.body
    const uniqueUser= await User.findOne({
        $or: [
            { userName: new RegExp(`^${userName}$`, "i") },
            { email: new RegExp(`^${email}$`, "i") },
        ],
    })
    if(uniqueUser){
       res.status(401).json({
        message:"User is already exist"
       })
       return;
    }
    const salt=await bcrypt.genSalt()
    const hashedPassword= await bcrypt.hash(password,salt)
    const hashedUser=new User({...req.body,password:hashedPassword})
    const createdUser=await hashedUser.save()
    res.status(200).json({
        message:"User created sucessfully !",
        createdUser:createdUser
    })
   } catch (error) {
     res.status(500).json({
        message:"somthing went wrong while creating User !",
        error:error
     })
     console.log(error)
   }
}
