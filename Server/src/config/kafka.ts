/**
 * Module: Kafka Producer Configuration
 * Description: Initializes Kafka producer for event-driven communication
 * Author: Aman Kumar Singh
 */
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "tracking-api",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

export const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("Kafka Connected!");
};
