import { z } from "zod";

export const messageSchema=z.object({
    message:z.string()
    .min(1,{message:'Message should be of at least one Character'})
    .max(250,{message:'Message should not be longer than 250 Character'}),
    createdAt:z.date(),
})