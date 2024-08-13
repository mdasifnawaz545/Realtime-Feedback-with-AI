import { z } from 'zod'

export const forgotPasswordSchema = z.object({

    email: z.string().email({ message: 'Enter a valid Email address' }),
    oldPassword: z.string()
        .min(8, { message: 'Password is less than 8 Character' })
        .max(32, { message: 'Password is Very Large' }),
    newPassword: z.string()
        .min(8, { message: 'Password is less than 8 Character' })
        .max(32, { message: 'Password is Very Large' })
})