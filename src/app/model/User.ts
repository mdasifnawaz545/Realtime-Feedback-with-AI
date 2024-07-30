import mongoose, { Document, Mongoose, Schema } from "mongoose"
import { Message } from "../../../types"
import { messageSchema } from "./Message"

interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpires: Date,
    verified:boolean,
    isAcceptingMessage: Boolean,
    messages: Message[],


}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true,"Username is Required"],
        trim:true,
        unique:true,
    },
    email: {
        type: String,
        required: [true,"Username is Required"],
        unique:true,
        match:[/.+\@.+/,"Enter a Valid Email"] // RegEx is used

    },
    password: {
        type: String,
        required: [true,"Password is Required"],
    },
    verifyCode: {
        type: String,
        required: [true,"Verification Code is Required"],
    },
    verifyCodeExpires: {
        type: Date,
        required: true,
    },
    verified:{
        type:Boolean,
    },
    isAcceptingMessage: {
        type: String,
        required: true,
        default:true
    },
    messages: [messageSchema]
})

const UserModel=(mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('User',userSchema))

// mongoose.models.User is saying that if this model is exitsting in the database then simply give this model reference to me otherwise create a new one's.

// Always Remeber that in DB most of the time you are using the user defined data types for the typesafety in the typescript of the creation of the models or schemas using mongoose and typescript.