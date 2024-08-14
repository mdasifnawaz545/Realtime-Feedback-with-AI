import DBConnection from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { sendVerificaitonEmail } from "@/helpers/sendVerificationEmail";
import bcryptjs from 'bcryptjs'
import { messageSchema } from "@/model/Message";

interface Props {
    params: {
        username: string,
        email: string,
        password: string,
        verifyCode: string
    }
}

export async function POST(request: Request) {

    let { username, email, password } = await request.json();
    console.log(username, "||", email, "||", password);
    await DBConnection();
    console.log("Database Connected")

    try {
        const userVerifiedByEmail = await UserModel.findOne({ email });
        let sixDigitCode: string = '';
        for (let i = 0; i < 6; i++) {
            sixDigitCode = sixDigitCode + Math.floor((Math.random() * 10)) as string;
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const expires = new Date();
        expires.setHours(expires.getHours() + 1);
        console.log(userVerifiedByEmail);
        if (userVerifiedByEmail) {
            if (await UserModel.findOne({ $and: [{ email }, { verified: true }] })) {
                return Response.json({
                    success: false,
                    message: 'User is already registered'
                }, {
                    status: 500,
                    statusText: "User is already registered"
                })
            }
            // Update the user as he is registered but not verified.
            else {
                userVerifiedByEmail.username = username,
                    userVerifiedByEmail.password = hashedPassword,
                    userVerifiedByEmail.verifyCode = sixDigitCode,
                    userVerifiedByEmail.verifyCodeExpires = expires,
                    userVerifiedByEmail.verified = false,
                    userVerifiedByEmail.isAcceptingMessages = true,
                    userVerifiedByEmail.messages = []
                await userVerifiedByEmail.save();
                const emailResponse = await sendVerificaitonEmail(username, email, sixDigitCode);
                if (!emailResponse.success) {
                    return Response.json({ success: false, message: emailResponse.message }, { status: 500 })
                }
                else {
                    return Response.json({ success: true, message: emailResponse.message }, { status: 200 })
                }
            }

        }

        // Sends the Verification Code as well as save the user in the Database.

        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode: sixDigitCode,
            verifyCodeExpires: expires,
            verified: false,
            isAcceptingMessages: true,
            messages: [],
        }
        );
        await newUser.save();


        const emailResponse = await sendVerificaitonEmail(username, email, sixDigitCode);
        if (!emailResponse.success) {
            return Response.json({ success: false, message: emailResponse.message }, { status: 500 })
        }
        else {
            return Response.json({ success: true, message: emailResponse.message }, { status: 200 })
        }

        // let finalVerification = await UserModel.findOne({ verifyCode: verifyCode })
        // if (finalVerification) {
        //     await UserModel.findOne({ email: email }, { $set: { verifyCode: true } })
        //     return Response.json({ success: true, message: "User Registered Successfully" }, { status: 500 })
        // }

    } catch (err) {
        console.error("Error while Registering the user")
        return Response.json({
            success: false,
            message: "Error while Registering the user"
        }, {
            status: 500,
            statusText: "Error while Registering the user"
        })
    }
}