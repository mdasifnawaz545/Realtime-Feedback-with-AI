import { sendVerificaitonEmail } from "@/helpers/sendVerificationEmail"
import DBConnection from "@/lib/dbConnection"
import UserModel from "@/model/User"
import { API_Response } from "../../../../../types"
import bcryptjs from 'bcryptjs'

type Props = {
    params: {
        email: string
    }
}

export async function GET(request: Request) {
    console.log(request.url)
    const email = request.url.substring(request.url.lastIndexOf('/') + 1)
    console.log(email)

    let VerificationCode: string = '';
    if (email) {
        console.log(email)
        await DBConnection();
        const user = await UserModel.findOne({ email });
        if (!user) {
            return Response.json({
                success: false,
                message: "User doesn't exists"
            })
        }
        for (let i = 0; i < 6; i++) {
            VerificationCode += Math.floor(Math.random() * 10)
        }
        user.verifyCode = VerificationCode;
        await user.save();
        const isSendMail: API_Response = await sendVerificaitonEmail(email, email, VerificationCode)
        if (isSendMail.success) {
            return Response.json({
                success: true,
                message: "Verification code sended successfully"
            })
        }
    }
    return Response.json({
        success: false,
        message: "Internal server error while sending the email"
    })

}
export async function POST(request: Request) {
    const { email, verificationCode, oldPassword, newPassword } = await request.json();
    const hashedOldPassword = await bcryptjs.hash(oldPassword, 10);

    console.log(email)
    console.log(verificationCode)
    console.log(oldPassword)
    console.log(newPassword)
    console.log(hashedOldPassword)

    await DBConnection();
    const VerfiedUser = await UserModel.findOne({ $and: [{ email }, { verifyCode: verificationCode }] });
    console.log(VerfiedUser)
    if (!VerfiedUser) {
        return Response.json({
            success: false,
            message: "Password or Verification code is incorrect"
        })
    }
    if(await bcryptjs.compare(oldPassword, VerfiedUser.password))
    VerfiedUser.password = await bcryptjs.hash(newPassword, 10);
    await VerfiedUser.save();
    return Response.json({
        success: true,
        message: "Password Updated Successfully! Login to proceed"
    })

}