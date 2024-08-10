import DBConnection from "@/lib/dbConnection";
import UserModel from "@/model/User";
// getServerSession is used to get the session from the backend server by providing the authOptions so that it can extract the session information from the redirect url of the session. 
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from 'next-auth'
import { messageSchema } from "@/model/Message";
import mongoose from "mongoose";

export async function POST(request: Request) {
    try {
        await DBConnection();
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User
        const { acceptMessages } = await request.json();
        const userId = user._id;
        if (session || user) {
            let updatedValueOfUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessages }, { new: true });
            if (updatedValueOfUser) {
                return Response.json({
                    success: true,
                    message: "User is Now accepting Messages"
                }, {
                    status: 200,
                    statusText: "User is Now accepting Messages"
                })
            }
            else {
                return Response.json({
                    success: false,
                    message: "User Not Found"
                }, {
                    status: 500,
                    statusText: "User Not Found"
                })
            }
        }
        else {
            return Response.json({
                success: false,
                message: "User Not found"
            }, {
                status: 500,
                statusText: "User Not found"
            })
        }

    } catch (error) {
        return Response.json({
            success: false,
            message: "Error while toggling the message acceptance"
        }, {
            status: 500,
            statusText: "Error while toggling the message acceptance"
        })
    }

}

export async function GET(request: Request) {
    try {
        await DBConnection();
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;
        const userId = new mongoose.Types.ObjectId(user._id);
        if (session || user) {
            const databaseUser = await UserModel.findById(userId);
            if (!databaseUser) {
                return Response.json({
                    success: false,
                    message: "User Not Found"
                }, {
                    status: 500,
                    statusText: "User Not Found"
                })
            }
            else {
                return Response.json({
                    success: true,
                    message: "User Found",
                    isAcceptingMessages: databaseUser.isAcceptingMessage
                }, {
                    status: 200,
                    statusText: "User Status Found"
                })
            }
        }
        else {
            return Response.json({
                success: false,
                message: "User Not Found"
            }, {
                status: 500,
                statusText: "User Not Found"
            })
        }

    } catch (error) {
        return Response.json({
            success: false,
            message: "Error while checking the message acceptance"
        }, {
            status: 500,
            statusText: "Error while checking the message acceptance"
        })
    }

}