import resend from "@/lib/Resend";
import VerificationEmail from "../../emails/VerificationEmail";
import {API_Response} from "../../types";

export async function sendVerificaitonEmail(username: string, email: string, verifyCode: string): Promise<API_Response> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: `TrueLine Feedback | Verification Code`,
            react: VerificationEmail({ username, otp: verifyCode })
        });
        return {
            success: true,
            message: `Email has been sent`
        }

    } catch (err) {
        // console.log(`Email has not been sent! Try again later...`);
        return {
            success: false,
            message: `Email has not been sent`
        }
    }
}