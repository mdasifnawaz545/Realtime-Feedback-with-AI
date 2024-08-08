import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import { User } from "next-auth";
import DBConnection from "@/lib/dbConnection";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
    try {
        await DBConnection();
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User
        if (!session || !user) {
            return Response.json({
                success: false,
                message: "User Not Found"
            }, {
                status: 500,
                statusText: "User Not Found"
            })
        }

        // Some times when we are using the concept of Aggregation in MongoDB then it will arise an error as the datatype of a particular value is not of specific mongodb type so in order to handle this issue we are explcitely going to  assign a datatype of mongoose to the value, which we are going to use in the aggregation.

        const userID = new mongoose.Types.ObjectId(user._id);

        const dbUser = await UserModel.aggregate([
            { $match: { id: userID } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': 1 } },
            { $group: { _id: '$id', message: { $push: '$messages' } } }
        ]);
        if (!dbUser || dbUser.length === 0) {
            return Response.json({
                success: false,
                message: "Messages Not Found for the user",
            },{
                status:500,
                statusText:"Messages Not Found for the user"
            })
        }
        return Response.json({
            success: true,
            message: "Messages Found for the user",
            messages: dbUser[0].messages,

        },{
            status:200,
            statusText:"Messages Found for the user"
        })

    } catch (error) {
        return Response.json({
            success: false,
            message: "Error while Rendering the message"
        }, {
            status: 500,
            statusText: "Error while Rendering  the message acceptance"
        })
    }
}