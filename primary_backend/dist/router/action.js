import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { Router } from "express";
import { authMiddleware } from "../middleware.js";
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
        const availableActions = await client.availableAction.findMany({
            select: {
                id: true,
                name: true,
                image: true,
            },
        });
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
router.post("/addAction", authMiddleware, async (req, res) => {
    try {
        const { name, image } = req.body;
        if (!name) {
            return res.status(400).json({
                message: "Action name is required",
            });
        }
        const action = await client.availableAction.create({
            data: {
                name,
                image: image || null,
            },
        });
        res.status(201).json({
            message: "Action added successfully",
            action,
        });
    }
    catch (error) {
        console.error("ADD ACTION ERROR:", error);
        res.status(500).json({
            message: "Failed to add action",
        });
    }
});
export const actionRouter = router;
