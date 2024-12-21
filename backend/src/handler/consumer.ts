import { redisClient } from '../config/redis.config'
import PlagiarismService from "../service/plagiarism.service";
import { filetotextConvert, urltotextConvert } from "../handler";
import { Payload } from "../types";
import { decrementCredit } from '../handler';

function processContent(format: any, content: string) {
    switch (format) {
        case "file":
            return filetotextConvert(content);
        case "website":
            return urltotextConvert(content);
        default:
            return content
    }
};
function serializeContent(content: string, type: string) {
    switch (type) {
        case "file":
            return { file: content }
        case "website":
            return { website: content }
        default:
            return { text: content }
    }
}
export const startConsuming = async (consumer: any) => {

    console.log("Consumer is consuming")

    try {

        await consumer.run({
            eachMessage: async ({ topic, partition, message }: any) => {
                try {
                    console.log("Received message:", topic, partition, message);

                    const key = message.key;
                    let { content, contentType: type } = JSON.parse(message.value);

                    content = processContent(type, content);

                    let payload: Payload = serializeContent(content, type);

                    let response;

                    switch (topic) {
                        case 'plag-detect':
                            response = await PlagiarismService.checkContent(payload)
                            break
                        case 'ai-content':
                            response = await PlagiarismService.checkContent(payload)
                            break
                        case 'match-content':
                            response = await PlagiarismService.checkContent(payload)
                            break
                    }

                    console.log("Response", response);
                    await redisClient.set(key, JSON.stringify(response));
                } catch (error) {
                    console.error("Error processing message:", error);
                }
            },
        });
    }

    catch (err: any) {
        throw new Error(err.message)
    }

};