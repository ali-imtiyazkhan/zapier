import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "zap-processor",
  brokers: ["localhost:9092"],
});

const TOPIC = "zap-runs";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const producer = kafka.producer();
  await producer.connect();

  console.log("Processor connected");

  while (true) {
    const rows = await prisma.zapRunOutbox.findMany({
      where: { processed: false },
      take: 10,
    });

    if (rows.length === 0) {
      await sleep(2000);
      continue;
    }

    await producer.send({
      topic: TOPIC,
      messages: rows.map((r) => ({
        key: r.zapRunId,
        value: JSON.stringify({ zapRunId: r.zapRunId }),
      })),
    });

    await prisma.zapRunOutbox.updateMany({
      where: { id: { in: rows.map((r) => r.id) } },
      data: { processed: true },
    });

    console.log(`Published ${rows.length} events`);
  }
}

main().catch(console.error);
