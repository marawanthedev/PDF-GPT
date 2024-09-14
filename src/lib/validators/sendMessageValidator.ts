import z from 'zod'

export const SendMessgeValidator = z.object({
    fileId: z.string(),
    message: z.string()
})