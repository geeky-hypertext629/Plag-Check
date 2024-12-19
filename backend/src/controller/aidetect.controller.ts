import { Request,Response } from "express";

class AiDetectController{
    public static submitContent(req:Request,res:Response){
        try{
            const {content}=req.body;
            
            //run the submit content service
            return res.status(200).json({message:"Submit OK",data:""})

        }
        catch(err:any){
            return res.status(500).json({message:err.message})
        }
    }
}
export default AiDetectController;