import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import DBConnection from "@/lib/dbConnection";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials: any): Promise<any> {

                await DBConnection();

                try {
                    const user = await UserModel.findOne({
                        $or: [{ email: credentials.identifier },
                        { username: credentials.identifier }]
                    })

                    if (!user) {
                        throw new Error('User is Not Registered')
                    }
                    if (!user.verified) {
                        throw new Error('Verify your email before Login')
                    }
                    const passwordVerified = await bcrypt.compare(credentials.password, user.password);
                    if (!passwordVerified) {
                        throw new Error('Password is Incorrect')
                    }
                    else {
                        console.log("user is returning")
                        return user;
                    }
                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.verified = user.verified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
                session.user.verified = token.verified;
            }
            return session
        }
    },
    pages: {
        signIn: '/signin',
        signOut: '/signout'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXT_AUTH_SECRET_KEY
}