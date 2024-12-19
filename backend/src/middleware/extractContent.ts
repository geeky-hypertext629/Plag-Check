import { Request, Response, NextFunction } from "express";
import { ContentSchema, MatchSchema, RequestSchema } from "../types";
import { filetotextConvert, urltotextConvert } from "../handler";

class Middleware{
    constructor(){}

    private static processContent(format: any, content: string){
        switch (format) {
            case "file":
                return filetotextConvert(content);
            case "website":
                return urltotextConvert(content);
            default:
                return content
        }
    };
    
    public static async extractContent(req: Request, res: Response, next: NextFunction) {
        try {
            // console.log("Request",req.body,req.query);
            const headerValidation = RequestSchema.safeParse(req.query);
            if (!headerValidation.success) {
                return res.status(400).json({ error: "Query need to be provided", details: headerValidation.error });
            }
            
            const { checkOption, contentFormat } = req.query;

          
            if (checkOption === "aicontent" || checkOption === "plagiarism") {
                const bodyValidation = ContentSchema.safeParse(req.body);
                if (!bodyValidation.success) {
                    return res.status(400).json({ error: "Content format is invalid", details: bodyValidation.error });
                }
    
                req.body.content = Middleware.processContent(contentFormat, req.body.content);
            } else {
                const bodyValidation = MatchSchema.safeParse(req.body);
                if (!bodyValidation.success) {
                    return res.status(400).json({ error: "Match format is invalid", details: bodyValidation.error });
                }
    
                req.body.contentA = Middleware.processContent(contentFormat, req.body.contentA);
                req.body.contentB = Middleware.processContent(contentFormat, req.body.contentB);
            }
    
            next();
        } catch (err:any) {
            return res.status(400).json({
                error: err  ? err.message : "An unexpected error occurred",
            });
        }
    };
    
}
export default Middleware