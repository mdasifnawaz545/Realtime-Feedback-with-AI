import DBConnection from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { Message } from "../../../../types";


export async function POST(request: Request) {
    try {
        console.log("Reauest 1")
        await DBConnection;
        const { username, message } = await request.json();
        const user = await UserModel.findOne({ username });
        console.log("Reauest 2")
    console.log(user)

        if (!user) {
            return Response.json({
                success: false,
                message: "User Not Found",
            }, {
                status: 500,
                statusText: "User Not Found"
            })
        }
        else{
            console.log("Rea")
            if (!user.isAcceptingMessages) {
                return Response.json({
                    success: false,
                    message: "Currently user is not accepting any messages",
                }, {
                    status: 500,
                    statusText: "Currently user is not accepting any messages"
                })
            }
            else {
                const messageObject = {
                    message,
                    createdAt: new Date()
                }
                user.messages.push(messageObject as Message);
                await user.save();
                return Response.json({
                    success: true,
                    message: "Message Sended Successfully",
                }, {
                    status: 200,
                    statusText: "Message Sended Successfully"
                })
            }
        }
       

    } catch (error) {
        return Response.json({
            success: false,
            message: "Error while Sending the message"
        }, {
            status: 500,
            statusText: "Error while Sending the message"
        })
    }
}