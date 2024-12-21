import { Payload } from "../types";

class PlagiarismService {
    public static async checkContent(apiPayload: Payload) {
        console.log("API Payload",apiPayload);
        const options = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.WINSTON_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(apiPayload),
        };


        const apiResponse=await fetch("https://api.gowinston.ai/v2/plagiarism", options);
        const apiResult: any = await apiResponse.json();


        if (apiResponse.status === 200) {
            return apiResult;
        }
        // console.log("API Result",apiResult);
        throw new Error(apiResult.response.error || "An unexpected error occurred");
    }

}
export default PlagiarismService;
