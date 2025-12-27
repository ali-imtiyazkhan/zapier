import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Imtiyaz Khan",
      email: "imtiyaz@test.com",
      password: "hashed_password",
    },
  });

  const webhookTrigger = await prisma.availableTrigger.create({
    data: { name: "Webhook Trigger" },
  });

  const emailAction = await prisma.availableAction.create({
    data: { name: "Send Email" },
  });

  const zap = await prisma.zap.create({
    data: {
      userId: user.id,
    },
  });

  await prisma.trigger.create({
    data: {
      zapId: zap.id,
      availableTriggerId: webhookTrigger.id,
    },
  });

  await prisma.action.create({
    data: {
      zapId: zap.id,
      availableActionId: emailAction.id,
      order: 1,
    },
  });

  const zapRun = await prisma.zapRun.create({
    data: {
      zapId: zap.id,
      metadata: { source: "seed" },
    },
  });

  await prisma.zapRunOutbox.create({
    data: {
      zapRunId: zapRun.id,
    },
  });

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
