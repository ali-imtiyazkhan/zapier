import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { Router } from "express";
import { authMiddleware } from "../middleware.js";
import { ZapCreateSchema } from "../types/index.js";
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
router.post("/zapCreate", authMiddleware, async (req, res) => {
    const parsed = ZapCreateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(411).json({
            message: "Incorrect input",
            errors: parsed.error.format(),
        });
    }
    try {
        // @ts-ignore
        const userId = req.userId;
        const zap = await client.zap.create({
            data: {
                userId,
                // 🔹 Create trigger
                trigger: {
                    create: {
                        availableTriggerId: parsed.data.availableTriggerId,
                    },
                },
                // 🔹 Create ordered actions
                actions: {
                    create: parsed.data.action.map((action, index) => ({
                        availableActionId: action.availableActionId,
                        // REQUIRED by Prisma schema
                        order: index,
                        sortingOrder: index,
                    })),
                },
            },
            include: {
                trigger: true,
                actions: {
                    orderBy: { order: "asc" },
                },
            },
        });
        return res.status(201).json({
            message: "Zap created successfully",
            zap,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Failed to create zap",
        });
    }
});
router.get("/zap", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    try {
        const zaps = await client.zap.findMany({
            where: {
                userId,
            },
            include: {
                trigger: {
                    include: {
                        availableTrigger: true,
                    },
                },
                actions: {
                    orderBy: {
                        order: "asc",
                    },
                    include: {
                        availableAction: true,
                    },
                },
            },
        });
        return res.status(200).json({
            message: "Zaps found successfully",
            zaps,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Failed to fetch zaps",
        });
    }
});
export const ZapRouter = router;
