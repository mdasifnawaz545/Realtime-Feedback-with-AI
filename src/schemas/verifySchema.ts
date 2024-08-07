import { z } from 'zod'

export const verifySchema = z.object({
    code1: z.string({ message: "Must be a string" }).min(1, { message: "Must be of 1 digit" }).max(1, { message: "Must be of 1 digit" }),
    code2: z.string({ message: "Must be a string" }).min(1, { message: "Must be of 1 digit" }).max(1, { message: "Must be of 1 digit" }),
    code3: z.string({ message: "Must be a string" }).min(1, { message: "Must be of 1 digit" }).max(1, { message: "Must be of 1 digit" }),
    code4: z.string({ message: "Must be a string" }).min(1, { message: "Must be of 1 digit" }).max(1, { message: "Must be of 1 digit" }),
    code5: z.string({ message: "Must be a string" }).min(1, { message: "Must be of 1 digit" }).max(1, { message: "Must be of 1 digit" }),
    code6: z.string({ message: "Must be a string" }).min(1, { message: "Must be of 1 digit" }).max(1, { message: "Must be of 1 digit" })
});