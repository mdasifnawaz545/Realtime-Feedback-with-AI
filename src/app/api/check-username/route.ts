import DBConnection from "@/lib/dbConnection";
import { messageSchema } from "@/model/Message";
import UserModel from "@/model/User";
import { usernameSchema } from "@/schemas/signUpSchema";
import { CommandSucceededEvent } from "mongodb";
import { z } from 'zod'

const userSchemaQuery = z.object({
    username: usernameSchema
})

export async function GET(request: Request) {
    await DBConnection();
    try {
        const { searchParams } = new URL(request.url);
        // We can also store the query in a single reference but if user will send more than one query then we also have to handle it so we are enclosing it into an object.
        const queryParam = {
            username: searchParams.get('username')
        }
        console.log(queryParam.username)
        // Validating from Zod
        let validateUsername = userSchemaQuery.safeParse(queryParam)
        if (!validateUsername.success) {
            // const usernameError = validateUsername.error.format().username?._errors || []
            return Response.json({ success: false, message: "Enter valid username" }, { status: 500, statusText: "Enter valid username" })
        }
        let { username } = validateUsername.data

        const existingVerifiedUser = await UserModel.findOne({ username, verified: true })

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "User already Exists"
            }, { status: 504, statusText: "User is already exists" })
        }
        else {
            return Response.json({
                success: true,
                message: "Username is unique"
            }, { status: 200, statusText: "Username is unique" })
        }

    } catch (err) {
        return Response.json({ success: false, message: "Error in Checking the username" }, { status: 500, statusText: "Error in Checking the username" })
    }
}