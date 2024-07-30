import {Document} from 'mongoose'

interface Message extends Document{
    message:string, // 's' of string in Typescript is written in Small.
    createdAt:Date
}