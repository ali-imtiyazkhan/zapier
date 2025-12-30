import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { Router } from "express";
const router = Router();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});
const adapter = new PrismaPg(pool);
const client = new PrismaClient({
    adapter,
    transactionOptions: {
        maxWait: 10000,
        timeout: 20000,
    },
});
router.get("/available", async (req, res) => {
    try {
        const availableActions = await client.availableAction.findMany();
        res.status(200).json({
            message: "All actions retrieved successfully",
            availableActions,
        });
    }
    catch (error) {
        console.error("Error fetching available actions:", error);
        res.status(500).json({
            message: "Failed to fetch available actions",
        });
    }
});
export const actionRouter = router;
