import { Request,Response } from "express";
import { decrementCredit } from "../handler";
import PlagiarismService from "../service/plagiarism.service";
import { Payload } from "../types";

class PlagirismController{
    public static async submitContent(req:Request,res:Response){
        try {
            const { contentFormat } = req.query;
            const { content } = req.body;

            let apiPayload:Payload={};
           
            if (contentFormat === "file") {
                apiPayload.file = content; 
            } else if (contentFormat === "text") {
                apiPayload.text = content; 
            } else {
                apiPayload.website = content; 
            }
            //run the submit content service
            // const apiResult = await PlagiarismService.checkContent(apiPayload);

            //decrement the credit
            // decrementCredit(req.cookies.plagToken)

            return res.status(200).json({ message: "Submit OK" });
        } catch (err: any) {
            return res.status(500).json({ message: err.message });
        }
    }
}
export default PlagirismController;