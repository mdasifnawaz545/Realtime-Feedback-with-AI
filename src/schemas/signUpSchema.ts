import { z } from "zod";
// import {  User } from "../../types"

export const usernameSchema = z.string()
    .min(3, 'Enter a Username of at least 3 character')
    .max(20, 'Enter a Username less than 15 character')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must be in a specified format');

export const signUpSchema = z.object({
    username: usernameSchema,
    email: z.string().email({ message: 'Enter a valid Email address' }),
    password: z.string()
        .min(8, { message: 'Password is less than 8 Character' })
        .max(32, { message: 'Password is Very Large' })
})