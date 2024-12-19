class PlagirismService{
    public static checkContent(content:string){
        if(!content){
            throw new Error("No content provided")
        }
        return ""
    }
}
export default PlagirismService;