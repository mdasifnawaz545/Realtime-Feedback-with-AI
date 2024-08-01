import DBConnection from "@/lib/dbConnection";
import UserModel from "@/model/User";
import { sendVerificaitonEmail } from "@/helpers/sendVerificationEmail";
import bcryptjs from 'bcryptjs'

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

}