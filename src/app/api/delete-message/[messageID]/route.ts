import DBConnection from "@/lib/dbConnection"
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from 'next-auth'
type Props = {
    messageID: any
}

export async function DELETE(request: Request) {
    console.log(request.url);
    const messageID=request.url.substring(request.url.lastIndexOf('/')+1)
    console.log(messageID)
    console.log("Message Delete Request Reached")
    await DBConnection();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
    console.log(user)
    // Here we are checking whether the user is authenticated or not but we are checking two condition i.e. if user wants to signup then automatically session is generated that's why we are also checking whether the session have user or not if it have then well and good if isn't then it will return from the first condition itself.
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "User is not authenticated"
        }, {
            status: 500,
            statusText: "User is not authenticated"
        })
    }
    try {
        console.log("Inside")
        const updateResponse = await UserModel.updateOne({ _id: user._id }, { $pull: { messages: { _id: messageID } } });
        console.log(updateResponse)
        if (updateResponse.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found, or already deleted"
            }, {
                status: 500,
                statusText: "Message not found, or already deleted"
            })
        }
        return Response.json({
            success: true,
            message: "Message Deleted"
        }, {
            status: 500,
            statusText: "Message Deleted"
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Failed to delete the message"
        }, {
            status: 500,
            statusText: "Failed to delete the message"
        })
    }
}