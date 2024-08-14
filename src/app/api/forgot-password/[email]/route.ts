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
    const { email, verificaitonCode, oldPassword, newPassword } = await request.json();
    const hashedOldPassword = bcryptjs.hash(oldPassword, 10);
    const hashednewPassword = bcryptjs.hash(newPassword, 10);
    await DBConnection();
    const VerfiedUser = await UserModel.findOne({ $and: [{ email }, { password: hashedOldPassword }, { verifyCode: verificaitonCode }] });
    if (!VerfiedUser) {
        return Response.json({
            success: false,
            message: "Password or Verification code is incorrect"
        })
    }
    VerfiedUser.password = hashednewPassword as unknown as string;
    await VerfiedUser.save();
    return Response.json({
        success: true,
        message: "Password Updated Successfully! Login to proceed"
    })

}