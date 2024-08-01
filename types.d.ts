import { Document } from 'mongoose'

interface User extends Document {
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpires: Date,
    verified: boolean,
    isAcceptingMessage: Boolean,
    messages: Message[],
}

interface Message extends Document {
    message: string, // 's' of string in Typescript is written in Small.
    createdAt: Date
}

interface API_Response {
    success: boolean,
    message: string,
    isAcceptingMessages?: boolean,
    messages?: Message[]

}
