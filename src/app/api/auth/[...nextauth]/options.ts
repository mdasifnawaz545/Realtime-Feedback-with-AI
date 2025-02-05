import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import DBConnection from "@/lib/dbConnection";
import UserModel from "@/model/User";
import GoogleProvider from "next-auth/providers/google"
import { use } from "react";

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
        }),
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID as string,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        //     // allowDangerousEmailAccountLinking: true,
        // })
    ],
    callbacks: {
        // async signIn({ user, account, profile, email, credentials }):Promise<any> {
        //     console.log("Google User - ");
        //     console.log(user, account, profile, email, credentials)
        //     if (account?.provider === 'google') {
        //         const email = user.email;
        //         if (email) {

        //             const isExistingUser = await UserModel.findOne({ email })
        //             if (isExistingUser) {
        //                 console.log(user);
        //                 return isExistingUser;
        //             }
        //             const hashPassword = bcrypt.hash(user.id, 10);
        //             const newUser = new UserModel({
        //                 username: user.email?.substring(0, user.email?.indexOf('@')),
        //                 email: user.email,
        //                 password: hashPassword,
        //                 verifyCode: 123456,
        //                 verifyCodeExpires: new Date(),
        //                 verified: user.verified,
        //                 isAcceptingMessages: true,
        //                 messages: [],
        //             })
        //             await newUser.save();
        //             return isExistingUser;
        //         }
        //         else {
        //             return false;
        //         }

        //     }

        //     return false;

        // },
        async jwt({ token, user }) {
            if (user) {
                console.log("Token User - ");
                console.log(user)
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