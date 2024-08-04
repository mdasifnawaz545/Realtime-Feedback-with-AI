import DBConnection from "@/lib/dbConnection";
import { messageSchema } from "@/model/Message";
import UserModel from "@/model/User";
import { usernameSchema } from "@/schemas/signUpSchema";
import { z } from 'zod'

const userSchemaQuery = z.object({
    username: usernameSchema
})

async function GET(request: Request) {
    await DBConnection();
    try {
        const { searchParams } = new URL(request.url);
        // We can also store the query in a single reference but if user will send more than one query then we also have to handle it so we are enclosing it into an object.
        const queryParam = {
            username: searchParams.get('username')
        }
        // Validating from Zod
        let validateUsername = usernameSchema.safeParse(queryParam.username)
        console.log(validateUsername)
        if (!validateUsername.success) {
            // const usernameError = validateUsername.error.format().username?._errors || []
            return Response.json({ success: false, message: "Enter valid username" }, { status: 500, statusText: "Enter valid username" })
        }

        const checkUsername = await UserModel.findOne({ username: validateUsername.data })
    } catch (err) {
        return Response.json({ success: 500, message: "Error in Checking the username" }, { status: 500, statusText: "Error in Checking the username" })
    }
}