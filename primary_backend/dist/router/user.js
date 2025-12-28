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
router.post("/signup", async (req, res) => {
    const { email, name, password } = req.body;
    try {
        const existingUser = await client.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }
        const user = await client.user.create({
            data: {
                email,
                name,
                password,
            },
        });
        return res.status(201).json({
            message: "User created successfully",
            user,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
        });
    }
});
router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await client.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid password",
            });
        }
        return res.json({
            message: "Signin successful",
            user,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
        });
    }
});
export const userRouter = router;
