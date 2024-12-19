import { Request,Response } from "express";

class PlagirismController{
    public static submitContent(req:Request,res:Response){
        try{
            
            //run the submit content service
            return res.status(200).json({message:"Submit OK",data:""})

        }
        catch(err:any){
            return res.status(500).json({message:err.message})
        }
    }
}
export default PlagirismController;