import express, { Request, Response } from "express"
import { User } from "../model/Usermodel"
import bcrypt from "bcrypt"
import { message } from "../model/MessageModel"
import jwt from"jsonwebtoken"
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


 export const sininController=async(req:Request,res:Response):Promise<void>=>{
   let user;
   try {
   if(req.body.userName){
     user=await User.findOne({userName:req.body.userName})
   }
   else{
    user=await User.findOne({email:req.body.email})
   }
   if(!user){
     res.status(401).json({
      message:"opps..looks like Invalid userName or email"
     })
     return;
   }
    const match=bcrypt.compareSync(req.body.password,user.password)
    if(!match){
      res.status(400).json({
        message:"Invalid pasword"
      })
      return;
    }
    const{password,...userData}=user.toObject()
     

  
      const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET!, {
          expiresIn: process.env.JWT_EXPIRE,
      });  
      res.cookie("token", token, { httpOnly: true,secure:true }).status(200).json({
        message: "Sign in successfully!",
        data: userData,
      });
   } catch (error) {
    res.status(400).json({
      message:"somthing went wrong!"
    })
   }
}


export const signoutController=(req:Request,res:Response)=>{
  try {
    res.clearCookie("token",{sameSite:true ,secure:true}).status(200).json({
      message:"Logout sucessfully"
    })
  } catch (error) {
    res.status(500).json({
      message:"somthing went wrong!"
    })
  }
     
}