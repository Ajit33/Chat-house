import { Request, Response } from "express";
import { User } from "../model/Usermodel";
import { message } from "../model/MessageModel";
import jwt, { JwtPayload } from "jsonwebtoken"
import { object } from "zod";


export async function findUserController(req: Request, res: Response):Promise<void> {
    try {
        const { name } = req.query;

      
        if (!name || typeof name !== 'string') {
            res.status(400).json({
                message: "Bad Request: 'name' query parameter is required and must be a string.",
            });
        }
   const regexname= new RegExp(`^${name}$`, 'i')
       
        const user = await User.find({ userName: regexname }).select('-password');
       
        if (!user.length) {
             res.status(404).json({
                message: "Oops! Looks like the user doesn't exist.",
            });
        }

       
        res.status(200).json({
            data: user,
        });
    } catch (error) {
        // Handle server errors
        console.error("Error finding user:", error);
         res.status(500).json({
            message: "Internal Server Error. Please try again later.",
        });
    }
}

export async function getUserController(req:Request,res:Response):Promise<void>{
    const token=req.cookies.token
    try {
       if(!token) {
        res.status(404).json({
            message:"token not found!"
        })
       }
       const secret=process.env.JWT_SECRET
       const decode=jwt.verify(token,secret as string) as JwtPayload 
       if(typeof decode!= "object" || !decode._id){
        res.status(500).json({
            message:"invalid token"
        })
       }
       const userId=decode._id
       const user=await User.findById(userId).select('-password')
    if(!user){
        res.status(404).json({
     message:"user not found !"
        })
    }
    res.status(200).json({
        data:user
    })
    } catch (error) {
        
    }
}