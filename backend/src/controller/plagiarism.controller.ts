import { Request,Response } from "express";
import dotenv from "dotenv";
dotenv.config();


class PlagirismController{
    public static async submitContent(req:Request,res:Response){
        try {
            const { contentFormat } = req.query;
            const { content } = req.body;
            let text: string | undefined;
            let file: string | undefined;
            let website: string | undefined;

           
            if (contentFormat === "file") {
                file = content; 
            } else if (contentFormat === "text") {
                text = content; 
            } else if (contentFormat === "website") {
                website = content; 
            } else {
                return res.status(400).json({ message: "Invalid contentFormat" });
            }
           
            if (!text && !file && !website) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            

            
            const apiPayload = {
                text,
                file,
                website,
            };

            
            const options = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.WINSTON_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(apiPayload),
            };

         
            const apiResponse = await fetch("https://api.gowinston.ai/v2/plagiarism", options);
            const apiResult : any = await apiResponse.json();

 
            if (apiResponse.status===400) {
                return res.status(apiResponse.status).json({ message: apiResult.message || "API error" });
            }

            return res.status(200).json({ message: "Submit OK", data: apiResult });
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }
}
export default PlagirismController;