import { Kafka } from "kafkajs";
const kafka = new Kafka({
    clientId: "zapier-consumer",
    brokers: ["localhost:9092"],
});
const TOPIC_NAME = "zap-events";
const GROUP_ID = "zap-worker-group";
async function startConsumer() {
    const consumer = kafka.consumer({ groupId: GROUP_ID });
    await consumer.connect();
    await consumer.subscribe({
        topic: TOPIC_NAME,
        fromBeginning: true,
    });
    console.log(" Kafka Consumer connected");
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const value = message.value?.toString();
                if (!value)
                    return;
                const event = JSON.parse(value);
                console.log("📥 Event received:", {
                    topic,
                    partition,
                    key: message.key?.toString(),
                    event,
                });
                await new Promise((r) => setTimeout(r, 1000));
            }
            catch (err) {
                console.error(" Error processing message", err);
            }
        },
    });
}
startConsumer().catch((err) => {
    console.error("Consumer failed:", err);
    process.exit(1);
});
