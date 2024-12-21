const { Kafka } = require("kafkajs");
import { startConsuming } from "../handler/consumer";

export const kafka = new Kafka({
  clientId: "plag-app",
  brokers: ["localhost:9092"],
});

export const producer = kafka.producer();

let isProducerConnected = false;

export const connectProducer = async () => {
  if (!isProducerConnected) {
    await producer.connect();
    isProducerConnected = true;
  }
}

export const consumer = kafka.consumer({ groupId: "plag-group" });

let isConsumerConnected = false;

export const connectConsumer = async () => {
  if (!isConsumerConnected) {
    await consumer.connect();
    isConsumerConnected = true;

    await consumer.subscribe({ topic: "plag-detect", fromBeginning: true });
    await consumer.subscribe({ topic: "ai-content", fromBeginning: true });
    await consumer.subscribe({ topic: "match-content", fromBeginning: true });

    await startConsuming(consumer);
  }
};
