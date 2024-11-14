

import mongoose, { Document } from "mongoose"

interface roomSchemaProps extends Document{
    name:string,
    members:string[]
}

const roomSchema=new mongoose.Schema<roomSchemaProps>({
  name:{type:String, required:true},
  members:[{type:String}]
})

export const room=mongoose.model<roomSchemaProps>("room",roomSchema)