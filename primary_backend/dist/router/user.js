import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { Router } from "express";
import { SigninSchema } from "../types/index.js";
import jwt from "jsonwebtoken";
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
router.get("/", (req, res) => {
    return res.json({
        message: " All is well "
    });
});
router.post("/signup", async (req, res) => {
    const { email, name, password } = req.body;
    const parsedData = SigninSchema.safeParse({ name, email, password });
    if (!parsedData.success) {
        res.status(411).json({
            message: "Incorrect data formet",
        });
    }
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
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.status(201).json({
            message: "User created successfully",
            token,
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
    const parsedData = SigninSchema.safeParse({ email, password });
    if (!parsedData.success) {
        res.status(411).json({
            message: "Incorrect data formet",
        });
    }
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
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        return res.json({
            message: "Signin successful",
            token,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
        });
    }
});
router.get("/user", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    const user = await client.user.findUnique({
        where: { id: userId },
        select: {
            name: true,
            email: true,
        },
    });
    return res.json({
        message: "User found successfully",
        user,
    });
});
export const userRouter = router;
