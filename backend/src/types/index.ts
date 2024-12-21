import z, { record } from 'zod';
import { Request } from 'express';

export const ContentSchema = z.object({
    content: z.string().transform((val) => val.trim()).refine((val) => val.length >= 10, {
        message: "Content must be at least 10 characters long",
    }),
    contentType:z.enum(["text", "file", "website"])
});
export const MatchSchema = z.object({
    contentA: z.string().transform((val) => val.trim()).refine((val) => val.length >= 10, {
        message: "Content must be at least 10 characters long",
    }),
    contentB: z.string().transform((val) => val.trim()).refine((val) => val.length >= 10, {
        message: "Content must be at least 10 characters long",
    })
});
export const RequestSchema = z.object({
    contentFormat: z.enum(["text", "file", "website"]),
    checkOption: z.enum(["aicontent", "plagiarism", "match"])
})

export interface URequest extends Request {
    headers: {
        contentFormat: string;
        checkOption: string;
    };
}

export type Payload = {
    text?: string,
    file?: string,
    website?: string
}
export const CreateTopicSchema = z.array(
    z.object({
        topic: z.string(),
        numPartitions: z.number()
    })
)
export const ProduceMessageSchema = z.object({
    topic:z.string(),
    partition:z.number(),
    message:z.record(z.any())  
})