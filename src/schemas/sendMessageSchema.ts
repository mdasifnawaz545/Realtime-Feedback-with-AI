import { z } from 'zod'
export const sendMessageSchema = z.object({
    message: z.string().min(10, { message: "Message at least 10 character" }).max(250, { message: "Message at least 10 character" })
})