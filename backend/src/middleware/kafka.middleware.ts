import { Request, Response, NextFunction } from "express";
import { kafka,connectConsumer,connectProducer,producer } from "../config/kafka.config";
import { v4 as uuidv4 } from 'uuid';
import { ProduceMessageSchema } from '../types'

class KafkaMiddleware {
    public static async producer(req: Request, res: Response,next:NextFunction) {

        // const validateSchema = ProduceMessageSchema.safeParse(req.body);
        // if (!validateSchema.success) {
        //     return res.status(400).json({ message: validateSchema.error.message });
        // }
                
        const {url}=req;
        console.log("The url",url)

        let topic:string;
        
        try {

            if(url.includes('/plag-detect')){
                topic="plag-detect";
            }
            else if(url.includes('/ai-content')){
                topic="ai-content";
            }
            else if(url.includes('/match-content')){
                topic="match-content";
            }
            else{
                return res.status(400).json({message:"No such topic"})
            }
            await connectProducer();
            console.log("Topic is",topic);
            await producer.send({
                topic,
                messages: [
                    {
                        key: uuidv4(),
                        partition:1,
                        value: JSON.stringify(req.body),
                    },
                ],
            });
            
            next();
            
        }
        catch (err: any) {
            return res.status(500).json({ message: err.message })
        }
    }

       /*  public static async consumer(req: Request, res: Response) {

            const consumer = kafka.consumer();
            await consumer.connect();

            const {url}=req;

            const {partition,message}=req.body;


            try {
                await consumer.subscribe({ topic, fromBeginning: true });

                await consumer.run({
                    eachMessage: async ({ topic, partition, message }) => {
                    const key = message.key.toString();
                    const value = JSON.parse(message.value.toString());
                    console.log(`Received message: key=${key}, value=`, value);
                
                    // Simulate processing
                    console.log(`Processing data:`, value);
                    },
                });
            }
            catch (err: any) {
                return res.status(500).json({ message: err.message })
            }
        } */
}
export default KafkaMiddleware;