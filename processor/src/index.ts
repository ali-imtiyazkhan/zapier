import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "zapier-app",
  brokers: ["localhost:9092"],
});

const TOPIC_NAME = "zap-events";
const prisma = new PrismaClient();

async function main() {
  const producer = kafka.producer();
  await producer.connect();

  console.log("✅ Kafka Producer connected");

  while (true) {
    const pendingRows = await prisma.zapRunOutbox.findMany({
      where: { processed: false },
      take: 10,
    });

    if (pendingRows.length === 0) {
      await sleep(2000);
      continue;
    }

    const messages = pendingRows.map((row) => ({
      key: row.zapRunId.toString(),
      value: JSON.stringify({
        zapRunId: row.zapRunId
      }),
    }));

    await producer.send({
      topic: TOPIC_NAME,
      messages,
    });

    await prisma.zapRunOutbox.updateMany({
      where: {
        id: { in: pendingRows.map((r) => r.id) },
      },
      data: { processed: true },
    });

    console.log(` Published ${pendingRows.length} events`);
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((err) => {
  console.error(" Error:", err);
  process.exit(1);
});
