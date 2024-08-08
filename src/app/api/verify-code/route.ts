import DBConnection from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { User } from "../../../../types";

export async function POST(request: Request) {
    await DBConnection();
    try {
        let { username, verificationCode } = await request.json();
        // console.log(verificationCode);
        // Here we are using decoder to decode the username which we are getting so that if browser by default sets an %20 for the spaces so that we can easily manage them.
        const decodeUsername = decodeURIComponent(username)
        console.log(decodeUsername)
        const user = await UserModel.findOne({ username: decodeUsername });
        console.log(user)
        if (user) {
            let isCodeVerified = user.verifyCode === verificationCode;
            let isCodeNotExpires = new Date(user.verifyCodeExpires) > new Date();
            console.log(isCodeVerified)
            console.log(isCodeNotExpires);
            if (isCodeVerified && isCodeNotExpires) {
                console.log("Salaam")
                user.verified = true;
                user.save();
                return Response.json({
                    success: true,
                    message: "User Verified"
                }, { status: 200, statusText: "User Verified" })
            }
            else if (!isCodeVerified) {
                return Response.json({
                    success: true,
                    message: "Invalid Code"
                }, { status: 200, statusText: "Invalid Code" })
            }
            else {
                return Response.json({
                    success: true,
                    message: "Code Expires"
                }, { status: 200, statusText: "Code Expires" })
            }
        }
        else {
            return Response.json({
                success: false,
                message: "User Not found"
            }, { status: 500, statusText: "User Not found" })

        }
    } catch (err) {
        return Response.json({
            success: false,
            message: "Error Occured"
        }, { status: 500, statusText: "Error Occured" })
    }
}