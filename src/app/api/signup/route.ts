import DBConnection from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { sendVerificaitonEmail } from "@/helpers/sendVerificationEmail";
import bcryptjs from 'bcryptjs'
import { NextResponse } from "next/server";
import { messageSchema } from "@/model/Message";
import { User } from "../../../../types";

interface Props {
    params: {
        username: string,
        email: string,
        password: string,
        verifyCode: string
    }
}

export async function POST({ params: { username, email, password, verifyCode
} }: Props) {
    await DBConnection();

    try {
        if (await UserModel.find({ $and: [{ email: email }, { verified: true }] })) {
            return NextResponse.json({
                success: false,
                message: 'User is already registered'
            }, {
                status: 500,
                statusText: "Error while Registering the user"
            })
        }
        else {
            let sixDigitCode: string = '';
            for (let i = 0; i < 6; i++) {
                sixDigitCode = sixDigitCode + Math.floor((Math.random() * 10)) as string;
            }
            const hashedPassword = await bcryptjs.hash(password, 10);
            const expires = new Date();
            expires.setHours(expires.getHours() + 1);
            const notVerified:User[] = await UserModel.find({ email: email })
            if (notVerified) {
                // Sends only the Verification Code
                const newUser = new UserModel({
                    notVerified.username=username,
                    notVerified.email,
                    notVerified.password: hashedPassword,
                    notVerified.verifyCode: sixDigitCode,
                    notVerified.verifyCodeExpires: expires,
                    notVerified.verified: false,
                    notVerified.isAcceptingMessage: true,
                    notVerified.messages: [],
                }
                )
                await newUser.save();
            }
            else {
                // Sends the Verification Code as well as save the user in the Database.
                const newUser = new UserModel({
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode: sixDigitCode,
                    verifyCodeExpires: expires,
                    verified: false,
                    isAcceptingMessage: true,
                    messages: [],
                }
                )
                await newUser.save();
            }
            const emailResponse = await sendVerificaitonEmail(username, email, sixDigitCode);
            if (!emailResponse.success) {
                return NextResponse.json({ success: false, message: emailResponse.message }, { status: 500 })
            }
            // else {
            //     return NextResponse.json({ success: true, message: emailResponse.message }, { status: 500 })
            // }

            let finalVerification = await UserModel.find({ verifyCode: verifyCode })
            if (finalVerification) {
                await UserModel.find({ email: email }, { $set: { verifyCode: true } })
                return NextResponse.json({ success: true, message: "User Registered Successfully" }, { status: 500 })
            }
        }

    } catch (err) {
        console.error("Error while Registering the user")
        return NextResponse.json({
            success: false,
            message: "Error while Registering the user"
        }, {
            status: 500,
            statusText: "Error while Registering the user"
        })
    }
}