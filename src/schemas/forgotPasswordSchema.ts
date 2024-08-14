import { z } from 'zod'

export const forgotPasswordSchema = z.object({

    email: z.string().email({ message: 'Enter a valid Email address' }),
    verificationCode:z.string().min(6,{message: 'Code should be of 6 digit'}).max(6,{message: 'Code should be of 6 digit'}),
    oldPassword: z.string()
        .min(8, { message: 'Password is less than 8 Character' })
        .max(32, { message: 'Password is Very Large' }),
    newPassword: z.string()
        .min(8, { message: 'Password is less than 8 Character' })
        .max(32, { message: 'Password is Very Large' })
})