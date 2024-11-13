import mongoose from "mongoose"
export  async function databaseConnectionString(){
   
   try {
    const connection= await mongoose.connect(process.env.DATBASE_URL as string)
    
    if(connection){
        console.log("database Connected sucessfully ")
    }
   } catch (error) {
    console.log("somthing went wrong while connecting to database",error)
   }

}