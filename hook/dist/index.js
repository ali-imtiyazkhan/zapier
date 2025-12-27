import "dotenv/config";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
});
const adapter = new PrismaPg(pool);
const client = new PrismaClient({
    adapter,
    transactionOptions: {
        maxWait: 10_000,
        timeout: 20_000,
    },
});
const app = express();
app.use(express.json());
app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const { userId, zapId } = req.params;
    const data = req.body;
    try {
        await client.$transaction(async (tx) => {
            const run = await tx.zapRun.create({
                data: {
                    zapId,
                    metadata: data,
                },
            });
            await tx.zapRunOutbox.create({
                data: {
                    zapRunId: run.id,
                },
            });
        });
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to process hook" });
    }
});
app.listen(3000, () => {
    console.log("your server is running on port 3000");
});
