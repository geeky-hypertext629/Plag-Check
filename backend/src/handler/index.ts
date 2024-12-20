import {redisClient} from '../config/redis.config'

export const filetotextConvert=async(file:string)=>{
    return file
}
export const urltotextConvert=async(url:string)=>{
    return url
}
export const decrementCredit=async(token:string)=>{
    redisClient.decr(token).then((reply: number) => {
        console.log("The reply is ",reply);
    }).catch((err: Error) => {
        throw new Error(err.message)
    });
}
