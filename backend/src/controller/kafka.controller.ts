import { Request, Response, NextFunction } from "express";
import { kafka, connectConsumer, connectProducer, producer } from "../config/kafka.config";
import { CreateTopicSchema } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { ContentSchema } from "../types";
import { redisClient } from "../config/redis.config";
import { decrementCredit } from "../handler";

class KafkaController {
    public static async producer(req: Request, res: Response) {

        const validateSchema = ContentSchema.safeParse(req.body);
        if (!validateSchema.success) {
            return res.status(400).json({ message: validateSchema.error.message });
        }

        const { url } = req;
        console.log("The url", url)

        let topic: string;

        try {

            if (url.includes('/plag-detect')) {
                topic = "plag-detect";
            }
            else if (url.includes('/ai-content')) {
                topic = "ai-content";
            }
            else if (url.includes('/match-content')) {
                topic = "match-content";
            }
            else {
                return res.status(400).json({ message: "No such topic" })
            }
            await connectProducer();
            console.log("Topic is", topic);

            let key = uuidv4();

            await producer.send({
                topic,
                messages: [
                    {
                        key,
                        partition: 0,
                        value: JSON.stringify(req.body),
                    },
                ],
            });

            console.log("Message in queue");

            const timeout = 5000; 
            let timeoutReached = false;

            setTimeout(() => {
                timeoutReached = true;
            }, timeout);

            const checkRedis = async () => {
                while (!timeoutReached) {
                    const response = await redisClient.get(key);

                    if (response) {
                        decrementCredit(req.cookies.plagToken)
                        return res.status(200).json({ message: "Status Ok", data: JSON.parse(response) });
                    }

                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                return res.status(404).json({ message: "No response found within timeout" });
            };

            await checkRedis();

        }
        catch (err: any) {
            return res.status(500).json({ message: err.message })
        }
    }


    public static async createTopic(req: Request, res: Response) {

        const validateSchema = CreateTopicSchema.safeParse(req.body);
        if (!validateSchema.success) {
            return res.status(400).json({ message: validateSchema.error.message });
        }
        console.log(req.body)
        const admin = kafka.admin();
        await admin.connect();

        try {
            const result = await admin.createTopics({
                topics: req.body,
                validateOnly: false,
            });

            if (result) {
                console.log("Topic Created Successfully");
            } else {
                console.log("Topic Already Exists or No Changes Made");
            }
            return res.status(200).json({ message: "Topic Created" })

        }
        catch (err: any) {
            return res.status(500).json({ message: err.message })
        }
        finally {
            await admin.disconnect();
            console.log("Admin Disconnected");
        }
    }
}
export default KafkaController;
