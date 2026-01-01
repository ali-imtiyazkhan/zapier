import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import cors from "cors";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
  transactionOptions: {
    maxWait: 10_000,
    timeout: 20_000,
  },
});

const app = express();

app.use(express.json({ limit: "2mb" }));
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.post("/api/v1/webhook/:zapId", async (req, res) => {
  const { zapId } = req.params;
  const metadata = req.body;

  try {
    const zap = await prisma.zap.findUnique({
      where: { id: zapId },
      select: { id: true },
    });

    if (!zap) {
      return res.status(404).json({
        error: "Invalid zapId",
      });
    }

    await prisma.$transaction(async (tx) => {
      const run = await tx.zapRun.create({
        data: {
          zapId,
          metadata,
        },
      });

      await tx.zapRunOutbox.create({
        data: {
          zapRunId: run.id,
        },
      });
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("HOOK ERROR:", err);
    res.status(500).json({
      error: "Failed to process webhook",
    });
  }
});

const PORT = process.env.HOOKS_PORT || 3002;

app.listen(PORT, () => {
  console.log(`Hooks service running on port ${PORT}`);
});
