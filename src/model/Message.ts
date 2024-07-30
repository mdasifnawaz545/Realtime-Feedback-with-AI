import mongoose,{Schema, Document} from "mongoose";
import { Message } from "../../types";

// Document is used for the typesafety for specifying the things defined here only for the mongoDB Document if we are using typescript.

export const messageSchema:Schema<Message> = new Schema({
message:{
    type:String, // 'S' of string in Mongoose is written in Capital.
     required:true,
},
createdAt:{
    type : Date,
    required :true,
    default:Date.now
}
})