import "dotenv/config";
import { Kafka } from "kafkajs";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import nodemailer from "nodemailer";
/* ------------------ DATABASE ------------------ */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
/* ------------------ KAFKA ------------------ */
const kafka = new Kafka({
    clientId: "zap-worker",
    brokers: ["localhost:9092"],
});
const TOPIC = "zap-runs";
const GROUP_ID = "zap-worker-group-v3";
/* ------------------ HELPERS ------------------ */
function resolve(template, data) {
    if (!template || typeof data !== "object" || data === null)
        return "";
    return template.replace(/{{(.*?)}}/g, (_, path) => {
        return (path
            .trim()
            .split(".")
            .reduce((acc, key) => acc?.[key], data) ?? "");
    });
}
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
async function sendEmail(payload) {
    if (!payload.to)
        throw new Error("Email recipient missing");
    await transporter.sendMail({
        from: `"Zapier Clone" <${process.env.EMAIL_USER}>`,
        to: payload.to,
        subject: payload.subject || "Zap Notification",
        html: payload.body || "<p>No content</p>",
    });
    console.log("📧 Email sent to:", payload.to);
}
async function sendSms(payload) {
    console.log("📩 SMS:", payload);
}
async function startWorker() {
    const consumer = kafka.consumer({ groupId: GROUP_ID });
    await consumer.connect();
    await consumer.subscribe({
        topic: TOPIC,
        fromBeginning: false,
    });
    console.log(" Worker connected");
    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            const raw = message.value?.toString();
            if (!raw)
                return;
            console.log(" Kafka message:", raw);
            const { zapRunId } = JSON.parse(raw);
            const zapRun = await prisma.zapRun.findUnique({
                where: { id: zapRunId },
                include: {
                    zap: {
                        include: {
                            actions: {
                                orderBy: { order: "asc" },
                                include: { availableAction: true },
                            },
                        },
                    },
                },
            });
            console.log(zapRun);
            if (!zapRun || zapRun.executed) {
                await consumer.commitOffsets([
                    {
                        topic,
                        partition,
                        offset: (Number(message.offset) + 1).toString(),
                    },
                ]);
                return;
            }
            try {
                const metadata = zapRun.metadata;
                console.log(" Metadata:", metadata);
                for (const action of zapRun.zap.actions) {
                    const config = (action.config ?? {});
                    console.log(" Executing:", action.availableAction.name, config);
                    if (action.availableAction.name === "Send Email") {
                        await sendEmail({
                            to: resolve(config.to, metadata),
                            subject: resolve(config.subject, metadata),
                            body: resolve(config.body, metadata),
                        });
                    }
                    if (action.availableAction.name === "sms-send") {
                        await sendSms({
                            to: resolve(config.to, metadata),
                            message: resolve(config.message, metadata),
                        });
                    }
                }
                await prisma.zapRun.update({
                    where: { id: zapRunId },
                    data: { executed: true },
                });
                await consumer.commitOffsets([
                    {
                        topic,
                        partition,
                        offset: (Number(message.offset) + 1).toString(),
                    },
                ]);
                console.log(` ZapRun ${zapRunId} executed`);
            }
            catch (err) {
                console.error(" Worker error:", err);
            }
        },
    });
}
startWorker().catch((err) => {
    console.error(" Worker crashed:", err);
    process.exit(1);
});
