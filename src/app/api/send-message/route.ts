import DBConnection from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { Message } from "../../../../types";
import { ModifiedPathsSnapshot, Document, Model, Types, ClientSession, DocumentSetOptions, QueryOptions, UpdateQuery, AnyObject, PopulateOptions, MergeType, Query, SaveOptions, ToObjectOptions, FlattenMaps, Require_id, UpdateWithAggregationPipeline, pathsToSkip, Error } from "mongoose";

export async function POST(request: Request) {
    try {
        await DBConnection;
        const { username, message } = await request.json();
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({
                success: false,
                message: "User Not Found",
            }, {
                status: 500,
                statusText: "User Not Found"
            })
        }
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "Currently user is not accepting any messages",
            }, {
                status: 500,
                statusText: "Currently user is not accepting any messages"
            })
        }
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
    }catch (error) {
        return Response.json({
            success: false,
            message: "Error while Sending the message"
        }, {
            status: 500,
            statusText: "Error while Sending the message"
        })
    }
}