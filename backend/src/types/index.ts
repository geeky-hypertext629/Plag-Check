import z from 'zod';
import { Request } from 'express';

export const ContentSchema = z.object({
    content: z.string().transform((val) => val.trim()).refine((val) => val.length >= 10, {
        message: "Content must be at least 10 characters long",
    })
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
