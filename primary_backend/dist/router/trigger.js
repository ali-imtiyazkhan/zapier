import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { Router } from "express";
import { authMiddleware } from "../middleware.js";
const router = Router();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 3,
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
        const availableTriggers = await client.availableTrigger.findMany();
        res.status(200).json({
            message: "All available triggers retrieved successfully",
            availableTriggers,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch available triggers",
        });
    }
});
router.post("/addTrigger", authMiddleware, async (req, res) => {
    try {
        const { name, image } = req.body;
        if (!name) {
            return res.status(400).json({
                message: "Action name is required",
            });
        }
        const action = await client.availableTrigger.create({
            data: {
                name,
                image: image || null,
            },
        });
        res.status(201).json({
            message: "Trigger added successfully",
            action,
        });
    }
    catch (error) {
        console.error("ADD Trigger ERROR:", error);
        res.status(500).json({
            message: "Failed to add trigger",
        });
    }
});
export const triggerRouter = router;
