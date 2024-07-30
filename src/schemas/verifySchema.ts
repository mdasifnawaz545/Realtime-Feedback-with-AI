import { z } from 'zod'

export const verifySchema = z.object({
    code: z.number({ message: "Must be a Number" }).min(6, { message: "Must be of 6 digit" }).max(6, { message: "Must be of 6 digit" })
});